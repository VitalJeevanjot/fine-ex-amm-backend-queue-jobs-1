import { Queue } from 'bullmq';

const queue = new Queue('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

async function remove_jobs() {
  // await queue.drain();
  await queue.obliterate();

  // Then list if there any
  const jobs = await queue.getJobs(["active", "waiting", "delayed", "completed"])
  console.log(jobs)
}

remove_jobs()