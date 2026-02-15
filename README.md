# BullMQ Redis NestJS Queue System

A production-ready distributed job queue system built with **BullMQ**, **Redis**, and **NestJS**. Demonstrates async job processing, automatic retry logic, error handling, and real-time queue monitoring.

## 🚀 Features

- **Distributed Job Queue**: Process jobs asynchronously across multiple workers
- **Automatic Retries**: Jobs automatically retry on failure with exponential backoff
- **Error Handling**: Comprehensive error handling and logging
- **Job Monitoring**: Real-time job status tracking (pending, active, completed, failed)
- **Redis Integration**: Leverages Redis for persistence and multi-worker coordination
- **Production Ready**: Graceful shutdown, connection pooling, and event-driven architecture

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Redis server running locally or remotely

## 🔧 Installation

1. **Clone the repository**
```bash
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Build the project**
```bash
npm run build
```

## 🏃 Running the Application

### 1. Ensure Redis is Running
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or locally
redis-server
```

### 2. Start the Worker (Terminal 1)
```bash
node dist/workes.js
```

Output:
```
🔧 Worker starting...
✨ Worker ready and waiting for jobs...
```

### 3. Produce Jobs (Terminal 2)
```bash
node dist/producer.js
```

Output:
```
🚀 Producing 3 jobs...
✅ Job 1 added with data: { foo: 'bar' }
📥 Processing job 1
✅ Job 1 processing complete!
🎉 Job 1 completed
```

## 🔄 Retry Logic

Jobs automatically retry on failure with exponential backoff:

```typescript
const job = await queue.add('job-name', jobData, {
  attempts: 3,          // Initial attempt + 2 retries
  backoff: {
    type: 'exponential',
    delay: 2000,        // Starting delay in ms
  },
});
```

**Current Configuration:**
- **Max Attempts**: 3
- **Backoff Strategy**: Exponential
- **Initial Delay**: 2 seconds

## ⚠️ Error Handling

The system handles multiple error scenarios:

1. **Job Processing Errors**: Logged and retried automatically
2. **Redis Connection Errors**: Graceful error handling
3. **Queue Overflow**: Jobs queued until worker available
4. **Graceful Shutdown**: Ctrl+C cleanly closes connections

## 📊 Monitor Jobs with Redis Insight

1. Open **Redis Insight** (http://localhost:8001)
2. Connect to **localhost:6379**
3. View queue keys:
   - `foo:jobs` - All job data
   - `foo:waiting` - Waiting jobs
   - `foo:active` - Currently processing
   - `foo:completed` - Finished jobs
   - `foo:failed` - Failed jobs

## 📁 Project Structure

```
src/
├── main.ts          # NestJS microservice entry
├── app.module.ts    # App module
├── app.service.ts   # Business logic
├── app.controller.ts # Controllers
├── producer.ts      # Job producer
├── workes.ts        # Job worker
└── jobs.ts          # Type definitions
```

## 📝 Available Scripts

```bash
npm run build        # Build TypeScript to JS
npm run start        # Run microservice
npm run start:dev    # Watch mode
npm run start:debug  # Debug mode
npm run start:prod   # Production mode
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## 🔐 Environment Variables

Create `.env` from `.env.example`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
NODE_ENV=development
```

## 🎯 Common Use Cases

- Email notifications
- Image processing
- Data exports/reports
- Webhook retries
- Batch operations
- Real-time notifications

## 📚 Resources

- [BullMQ Docs](https://docs.bullmq.io/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Redis Docs](https://redis.io/documentation)

## 📄 License

MIT
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
