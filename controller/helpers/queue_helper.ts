import { Queue, QueueScheduler } from 'bullmq';
import { QueueEvents } from 'bullmq';

require('dotenv').config({ path: __dirname + '/../../.env' })
import { setRequiredVariable, getUserDetails } from '../../helpers';


const queueScheduler = new QueueScheduler('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});
const queue = new Queue('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})
const queueEvents = new QueueEvents('tasks', {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
})

// async function testDetails () {
//   console.log(setRequiredVariable('APIKEY'))
//   console.log(setRequiredVariable('APISECRET'))
//   let data = await getUserDetails(setRequiredVariable('APIKEY')!, setRequiredVariable('APISECRET')!, 'https://apitest.fine.exchange')
//   console.log(data)
// }
// testDetails()

async function addJobs (job_data: any) {
  // await queue.add(
  //   'submarine',
  //   { color: 'yellow' },
  //   {
  //     repeat: {
  //       cron: '* 15 3 * * *',
  //     },
  //   },
  // );
  // var get_task_keys = Object.keys(job_data)
  // var get_required_key = ''
  // for (let index = 0; index < get_task_keys.length; index++) {
  //   const element = get_task_keys[index];
  //   if (get_task_keys.includes('task_data_api_plain_pretext_')) {
  //     get_required_key = get_task_keys[index]
  //   }
  // }

  // let user_unique_id = get_required_key.replace('task_data_api_plain_pretext_', '')
  // let get_user_details = getUserDetails(
  //   job_data.api_key,
  //   job_data.api_secret,
  //   job_data.api_url
  // )
  // amount & price is in percentage

  // DEMO:
  // await queue.add(
  //   'createOrder',
  //   {
  //     order_id: '',
  //     exchange_url: "https://apitest.fine.exchange",
  //     symbol: 'XHT/USDT',
  //     type: 'limit',
  //     side: 'buy',
  //     amount: "10", // per cent from wallet
  //     price: "5", // per cent of spread
  //     api_key: setRequiredVariable('APIKEY'),
  //     api_secret: setRequiredVariable('APISECRET'),
  //     timeElapsed: 0, // total time elapsed since the task running
  //     totalVolume: 0, // total volume made so far by this task in this pair (in base asset)
  //     volumeInHour: 0, // volume per hour made by this task (average, instead of every hour), task continuation requirement based on this
  //     volumeInEachHour: 0, // exact volume per hour made by this task
  //     fine_exchange_user_id: 0, // unique id (email probably) of this fine exchange user (from fine exchange mainnet)
  //     task_id: 0 // to be send by front-end (unique if of the task)
  //   }
  //   ,
  //   {
  //     delay: 5000
  //     // jobId: index.toString()
  //   }
  // );

  // REAL:
  await queue.add(
    'createOrder',
    {
      order_id: '',
      exchange_url: "https://apitest.fine.exchange",
      symbol: 'XHT/USDT',
      type: 'limit',
      side: 'buy',
      amount: "10", // per cent from wallet
      price: "5", // per cent of spread
      api_key: setRequiredVariable('APIKEY'),
      api_secret: setRequiredVariable('APISECRET'),
      timeElapsed: 0, // total time elapsed since the task running
      totalVolume: 0, // total volume made so far by this task in this pair (in base asset)
      volumeInHour: 0, // volume per hour made by this task (average, instead of every hour), task continuation requirement based on this
      volumeInEachHour: 0, // exact volume per hour made by this task
      fine_exchange_user_id: 0, // unique id (email probably) of this fine exchange user (from fine exchange mainnet)
      task_id: 0 // to be send by front-end (unique if of the task)
    }
    ,
    {
      delay: 5000
      // jobId: index.toString()
    }
  );


  // const repeatableJobs = await queue.getRepeatableJobs();
  // console.log(repeatableJobs)

  // for (var i = 0; i < 2; i++) {
  //   await queue.add('dataFetching', { url: 'https://www.boredapi.com/api/activity' }, {
  //     repeat: {
  //       every: 100,
  //       limit: 3
  //     },
  //     jobId: i.toString()
  //   })
  // }
}

// addJobs('')

var i = 0
queueEvents.on('completed', (data: any) => {
  console.log(`${data.jobId} has completed and returned`);
  console.log(data.returnvalue)
  i++
  console.log(i)
  var current = new Date();
  console.log(current)

  if (data.returnvalue.continue == true) {
    addJobs(data.returnvalue)
  } else {
    // log job discontinued and specify reason (by user or by system (intentionally or error))
  }
});

export {
  addJobs
}





