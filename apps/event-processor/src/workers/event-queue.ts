import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { GooglePlacesSource } from '../apis/google-places';
import { createClient } from '@supabase/supabase-js';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const eventQueue = new Queue('event-discovery', { connection });

export const eventWorker = new Worker(
  'event-discovery',
  async (job: Job) => {
    const { sourceType, params } = job.data;
    
    console.log(`Processing ${sourceType} job:`, job.id);
    
    try {
      let source;
      
      switch (sourceType) {
        case 'google-places':
          source = new GooglePlacesSource();
          break;
        default:
          throw new Error(`Unknown source type: ${sourceType}`);
      }
      
      await source.authenticate();
      
      const rawEvents = await source.fetchEvents(params);
      
      for (const rawEvent of rawEvents) {
        const standardEvent = source.transform(rawEvent);
        
        const { data: stagingData, error: stagingError } = await supabase
          .from('events_staging')
          .insert({
            source_id: source.id,
            external_id: rawEvent.externalId,
            raw_data: rawEvent.rawData,
            processed_data: standardEvent,
            status: 'pending',
            confidence_score: 0.75,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (stagingError) {
          console.error('Failed to insert staging event:', stagingError);
          continue;
        }
        
        const { error: eventError } = await supabase
          .from('discovered_events')
          .insert({
            staging_id: stagingData.id,
            source_id: source.id,
            title: standardEvent.title,
            description: standardEvent.description,
            category: standardEvent.category,
            tags: standardEvent.tags,
            start_time: standardEvent.startTime,
            end_time: standardEvent.endTime,
            venue_name: standardEvent.venue.name,
            venue_address: standardEvent.venue.address,
            latitude: standardEvent.venue.lat,
            longitude: standardEvent.venue.lng,
            external_url: standardEvent.externalUrl,
            cost_type: standardEvent.price?.type || 'free',
            moderation_status: 'pending',
            created_at: new Date().toISOString()
          });
        
        if (eventError) {
          console.error('Failed to insert discovered event:', eventError);
        }
      }
      
      const { error: historyError } = await supabase
        .from('fetch_history')
        .insert({
          source_id: source.id,
          started_at: job.timestamp ? new Date(job.timestamp).toISOString() : new Date().toISOString(),
          completed_at: new Date().toISOString(),
          status: 'success',
          events_found: rawEvents.length,
          events_processed: rawEvents.length,
          execution_time_ms: Date.now() - (job.timestamp || Date.now())
        });
      
      if (historyError) {
        console.error('Failed to log fetch history:', historyError);
      }
      
      return { processed: rawEvents.length };
    } catch (error) {
      console.error(`Error processing ${sourceType} job:`, error);
      throw error;
    }
  },
  { connection }
);

eventWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

eventWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export async function scheduleEventFetch(sourceType: string, params: any) {
  const job = await eventQueue.add(
    'fetch-events',
    { sourceType, params },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    }
  );
  
  return job;
}