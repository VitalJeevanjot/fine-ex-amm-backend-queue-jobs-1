import { Queue, QueueScheduler } from 'bullmq';
import { QueueEvents } from 'bullmq';
import ccxt from 'ccxt';
import logger from '../../logger';

require('dotenv').config({ path: __dirname + '/../../.env' })
import { setRequiredVariable, encryptData } from '../../helpers';


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

async function getOrderBook(job: any, res: any, uniq_id: string) {
  var obj: any = {
      urls:
      {
        api:
        {
          rest:
            job.api_url
        }
      }
    }
  try {
    const exchange: any = new ccxt.hollaex(obj)
    let get_orderbook = await exchange.fetchOrderBook(job.symbol, 5)
    if(get_orderbook.bids.length < 1 || get_orderbook.asks.length < 1) {
    return res.status(200).json({ // status 200, so it can be passed from the function in load balancer
      status: 'Error: No orders available to take reference from.' + uniq_id,
    })
  }
  } catch(e:any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ': getOrderBook: Unexpected Error: ' + e.stack)
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      status: 'Error: Call not supported!.',
    })
  }
}

async function addJobs (job_data: any, email: string, res: any) {
  var _obj = {
      order_id: job_data.order_id ? job_data.order_id : '',
      api_url: job_data.api_url,
      symbol: job_data.symbol.value ? job_data.symbol.value : job_data.symbol,
      type: 'limit',
      side: job_data.side,
      amount: job_data.amount, // per cent from wallet
      price: job_data.spread_percent, // per cent of spread
      api_key: setRequiredVariable('APIKEY'),
      api_secret: setRequiredVariable('APISECRET'),
      timeStarted: job_data.timeStarted ? job_data.timeStarted : Date.now(), // total time elapsed since the task running
      timeElapsed: job_data.timeElapsed ? job_data.timeElapsed : 0, // total time elapsed since the task running
      totalVolume: job_data.totalVolume ? job_data.totalVolume : 0, // total volume made so far by this task in this pair (in base asset)
      volumeInHour: job_data.volumeInHour ? job_data.volumeInHour : 0, // volume per hour made by this task (average, instead of every hour), task continuation requirement based on this
      volumeInEachHour: job_data.volumeInEachHour ? job_data.volumeInEachHour : 0, // exact volume per hour made by this task
      fine_exchange_user_id: email ? email : job_data.fine_exchange_user_id, // unique id (email probably) of this fine exchange user (from fine exchange mainnet)
      task_id: job_data.task_uuid, // to be send by front-end (unique if of the task)
      login_api_apiKey_S: job_data.login_api_apiKey_S,
      seconds_interval: job_data.seconds_interval
    }
  let uniq_id = job_data.login_api_apiKey_S
  await getOrderBook(_obj, res, uniq_id) // Test if order book exist (because this is required to refer price spread in worker)
  await addToQueue(_obj, job_data, 0)
}

async function addToQueue(_obj: any, job_data: any, again: any) {
  try {
    await queue.add(
      'createOrder',
      _obj,
      {
        delay: parseInt(job_data.seconds_interval) * 1000
        // jobId: index.toString()
      }
    );
  } catch (e: any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: addToQueue: " + "again: " + again + ": " + _obj.login_api_apiKey_S+ " error: " + e.toString() + " error_stack: " + e.stack)
  }
}

queueEvents.on('completed', (data: any) => {
  console.log(`${data.jobId} has completed and returned`);
  console.log(data.returnvalue) // TODO: remove this from here after it is working
  logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
  
  if (data.returnvalue.continue == true) {
    console.log(data.returnvalue)
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: job_repeated: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
    addJobs(data.returnvalue, data.returnvalue.fine_exchange_user_id, 1)
    // TODO: update db
  } else {
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: job_not_repeated: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
    // TODO: update db
    // log job discontinued and specify reason (by user or by system (intentionally or error))
  }
});

export {
  addJobs
}





