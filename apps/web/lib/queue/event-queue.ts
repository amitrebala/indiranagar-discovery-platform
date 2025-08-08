import { Redis } from '@upstash/redis';

// Simple queue implementation using Upstash Redis
// This replaces BullMQ for serverless compatibility

const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export interface EventJob {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export class EventQueue {
  private queueKey = 'event-queue';
  private processingKey = 'event-processing';

  async addJob(type: string, data: any): Promise<string> {
    if (!redis) {
      console.log('Queue not available - Redis not configured');
      return '';
    }

    const job: EventJob = {
      id: crypto.randomUUID(),
      type,
      data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    await redis.lpush(this.queueKey, JSON.stringify(job));
    console.log(`📝 Job ${job.id} added to queue`);
    return job.id;
  }

  async getNextJob(): Promise<EventJob | null> {
    if (!redis) return null;

    // Move job from queue to processing - use brpoplpush for atomicity
    const jobStr = await redis.rpop(this.queueKey);
    if (jobStr) {
      await redis.lpush(this.processingKey, jobStr);
    }
    if (!jobStr) return null;

    return JSON.parse(jobStr as string);
  }

  async completeJob(jobId: string): Promise<void> {
    if (!redis) return;

    // Remove from processing queue
    const processing = await redis.lrange(this.processingKey, 0, -1);
    for (const jobStr of processing) {
      const job = JSON.parse(jobStr as string);
      if (job.id === jobId) {
        await redis.lrem(this.processingKey, 1, jobStr);
        console.log(`✅ Job ${jobId} completed`);
        break;
      }
    }
  }

  async getQueueSize(): Promise<number> {
    if (!redis) return 0;
    return await redis.llen(this.queueKey);
  }

  async getProcessingSize(): Promise<number> {
    if (!redis) return 0;
    return await redis.llen(this.processingKey);
  }
}

export const eventQueue = new EventQueue();