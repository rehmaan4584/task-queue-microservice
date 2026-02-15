import { Queue } from 'bullmq';

const connection = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
};

async function produceJobs() {
  let queue: Queue;
  
  try {
    queue = new Queue('foo', { connection });
    
    console.log('🚀 Producing 3 jobs with retry logic...\n');

    // Add jobs with retry configuration
    const job1 = await queue.add(
      'job-1',
      { foo: 'bar' },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
    console.log(`✅ Job ${job1.id} added - Data: ${JSON.stringify(job1.data)}`);
    console.log(`   Retry config: 3 attempts with exponential backoff\n`);

    const job2 = await queue.add(
      'job-2',
      { qux: 'baz' },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
    console.log(`✅ Job ${job2.id} added - Data: ${JSON.stringify(job2.data)}\n`);

    // Simulate a job that might fail (for testing retry)
    const job3 = await queue.add(
      'job-3',
      { test: 'learning bullmq', shouldFail: false }, // Set to true to test retries
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
    console.log(`✅ Job ${job3.id} added - Data: ${JSON.stringify(job3.data)}\n`);

    console.log('⏳ Waiting 10 seconds for worker to process...\n');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('📊 Queue Statistics:');
    const counts = await queue.getJobCounts();
    console.log(`   Waiting: ${counts.waiting}`);
    console.log(`   Active: ${counts.active}`);
    console.log(`   Completed: ${counts.completed}`);
    console.log(`   Failed: ${counts.failed}`);
    console.log(`   Delayed: ${counts.delayed}\n`);

    await queue.close();
    console.log('✨ Producer done!\n');
  } catch (error) {
    console.error('❌ Producer error:', error instanceof Error ? error.message : String(error));
    if (queue) {
      await queue.close();
    }
    process.exit(1);
  }
}

produceJobs();
