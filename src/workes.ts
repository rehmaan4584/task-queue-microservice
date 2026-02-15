import { Worker, QueueEvents } from 'bullmq';

const connection = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
};

console.log('🔧 Worker starting...\n');

const worker = new Worker(
  'foo',
  async (job) => {
    try {
      console.log(`\n📥 Processing job ${job.id}`);
      console.log(`   Name: ${job.name}`);
      console.log(`   Data: ${JSON.stringify(job.data)}`);
      console.log(`   Attempt: ${job.attemptsMade + 1} of ${job.opts.attempts}`);
      
      // Simulate processing with potential failure for testing
      if (job.data.shouldFail === true && job.attemptsMade < 2) {
        throw new Error('Simulated job failure for retry testing');
      }
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ Job ${job.id} processing complete!`);
      return { 
        result: 'success', 
        processedData: job.data,
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`⚠️  Job ${job.id} error (attempt ${job.attemptsMade + 1}): ${errorMessage}`);
      throw error; // Re-throw to trigger retry
    }
  },
  { connection }
);

// Worker events
worker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed`);
  console.log(`   Result: ${JSON.stringify(job.returnvalue)}\n`);
});

worker.on('failed', (job, err) => {
  if (job && job.attemptsMade < (job.opts.attempts - 1)) {
    console.log(`⚠️  Job ${job.id} failed: ${err.message}`);
    console.log(`   Retrying... (Attempt ${job.attemptsMade + 1}/${job.opts.attempts})\n`);
  } else {
    console.log(`❌ Job ${job.id} failed permanently: ${err.message}`);
    console.log(`   All ${job.opts.attempts} attempts exhausted\n`);
  }
});

worker.on('error', (err) => {
  console.error('❌ Worker error:', err);
});

worker.on('stalled', (jobId, prev) => {
  console.log(`⚠️  Job ${jobId} stalled`);
});

// Queue-level events
const queueEvents = new QueueEvents('foo', { connection });

queueEvents.on('completed', ({ jobId }) => {
  console.log(`   [Queue] Job ${jobId} marked as completed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`   [Queue] Job ${jobId} marked as failed`);
});

console.log('✨ Worker ready and waiting for jobs...\n');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down worker gracefully...');
  try {
    await worker.close();
    await queueEvents.close();
    console.log('✅ Worker closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  try {
    await worker.close();
    await queueEvents.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});