import 'dotenv/config';
import { eventWorker, eventQueue, scheduleEventFetch } from './workers/event-queue';

async function startEventProcessor() {
  console.log('🚀 Starting Event Processor Service...');
  
  console.log('📡 Connected to Redis');
  console.log('🗄️ Connected to Supabase');
  
  await eventWorker.run();
  console.log('👷 Event worker started');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Scheduling test fetch for Indiranagar area...');
    await scheduleEventFetch('google-places', {
      lat: 12.9716,
      lng: 77.6411,
      radius: 2000,
      limit: 10
    });
  }
  
  const repeatableJobs = await eventQueue.add(
    'periodic-fetch',
    { sourceType: 'google-places', params: { lat: 12.9716, lng: 77.6411 } },
    {
      repeat: {
        pattern: '0 */6 * * *'
      }
    }
  );
  
  console.log('⏰ Scheduled periodic fetches');
  
  process.on('SIGTERM', async () => {
    console.log('📴 Shutting down gracefully...');
    await eventWorker.close();
    process.exit(0);
  });
}

startEventProcessor().catch(console.error);