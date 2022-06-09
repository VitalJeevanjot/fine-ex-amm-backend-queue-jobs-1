import { Queue } from 'bullmq';

const queue = new Queue('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

async function list_jobs() {
  console.log("--active--")
  let jobs = await queue.getJobs(["active"])
  console.log(jobs)
  console.log("--waiting--")
  jobs = await queue.getJobs(["waiting"])
  console.log(jobs)
  console.log("--delayed--")
  jobs = await queue.getJobs(["delayed"])
  console.log(jobs)
  console.log("--completed--")
  jobs = await queue.getJobs(["completed"])
  console.log(jobs)
  console.log("--failed--")
  jobs = await queue.getJobs(["failed"])
  console.log(jobs)
}

list_jobs()