import { Queue, QueueScheduler } from 'bullmq';
import { QueueEvents } from 'bullmq';
import ccxt from 'ccxt';
import logger from '../../logger';
import axios from 'axios'

require('dotenv').config({ path: __dirname + '/../../.env' })
import { setRequiredVariable, encryptData } from '../../helpers';




const queueScheduler = new QueueScheduler('tasks', {
  connection: {
    host: setRequiredVariable('REDIS_HOST'),
    port: setRequiredVariable('REDIS_PORT')
  }
});
const queue = new Queue('tasks', {
  connection: {
    host: setRequiredVariable('REDIS_HOST'),
    port: setRequiredVariable('REDIS_PORT')
  }
})
const queueEvents = new QueueEvents('tasks', {
  connection: {
    host: setRequiredVariable('REDIS_HOST'),
    port: setRequiredVariable('REDIS_PORT')
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
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: getOrderBook: " + job.login_api_apiKey_S + ": job_id: " + job.task_unique_id + ": returned_value: " + encryptData(JSON.stringify(get_orderbook)))
    if(get_orderbook.bids.length < 1 || get_orderbook.asks.length < 1) {
      return res.status(200).json({ // status 200, so it can be passed from the function in load balancer
        status: uniq_id + ': Error: No orders available to take reference from.',
      })
    }
  } catch(e:any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ': getOrderBook: Unexpected Error: ' + e.stack)
    if(res.headersSent) {
      return
    }
    return res.status(500).json({
      status: uniq_id + ': Error: Call not supported!.',
    })
  }
}


async function saveToDb(job_data: any, login_email: string, res: any, _continue: any, id: string) {
  try {
    // send data to db (db_post_data)
    var url = `http://${setRequiredVariable('SERVER_DB_URL')}:${setRequiredVariable('SERVER_DB_PORT')}${setRequiredVariable('SAVE_SERVICE_ENDPOINT')}`
    job_data.taskRunningServer = setRequiredVariable('SERVER_NAME')
    job_data.continue = _continue
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: called: " + job_data.login_api_apiKey_S.toString() + ": " + encryptData(JSON.stringify(job_data)))
    let response = await axios.post(url,
      {
        login_email: login_email, 
        body: job_data,
        uid: id
      }
    )
    // console.log("response.data>")
    // console.log(response.data)
    // console.log("<response.data")
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: db_post_data: " + job_data.login_api_apiKey_S + ": job_id: " + id + ": returned_value: " + encryptData(JSON.stringify(response.data)))
    addJobs(job_data, login_email, res, _continue, id)
  } catch(e: any) {
    try {
      logger.info(setRequiredVariable('SERVER_NAME') + ': getOrderBook: Unexpected Error: ' + e.stack + ': e_response: ' + (e.response) ? JSON.stringify(e.response.data) : 'null')
      if(res.headersSent) {
        return
      }
      return res.status(200).json({ // status 200, so it can be passed from the function in load balancer
        status: job_data.login_api_apiKey_S + ': ' + e.response.data.message,
      })
    } catch(e:any) {
      logger.info(setRequiredVariable('SERVER_NAME') + ': getOrderBook: Unexpected Error: ' + e.stack + ': e_tostring: ' + e.toString())
      if(res.headersSent) {
        return
      }
      return res.status(200).json({ // status 200, so it can be passed from the function in load balancer
        status: job_data.login_api_apiKey_S + ': ' + e.toString(),
      })
    }
  }
}


async function addJobs (job_data: any, login_email: string, res: any, _continue: any, id: string) {
  // TODO: Get lastest saved data from db and use it from there
  var url = `http://${setRequiredVariable('SERVER_DB_URL')}:${setRequiredVariable('SERVER_DB_PORT')}/get_task_by_id`
  var response: any
  try {
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: db_task_status: called: " + job_data.login_api_apiKey_S.toString() + ": " + encryptData(JSON.stringify(job_data)))
    response = await axios.post(url,
      {
        id: id,
        login_api_apiKey_S: job_data.login_api_apiKey_S
      }
    )
    console.log(response.data)
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: db_task_status: response: " + job_data.login_api_apiKey_S.toString() + ": " + encryptData(JSON.stringify(response.data)))
  } catch(e: any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: db_task_status: error: " + job_data.login_api_apiKey_S.toString() + " error: " + e.toString() + " error_stack: " + e.stack)
  }
  var _obj = {
      taskRecentOrderId: job_data.taskRecentOrderId ? job_data.taskRecentOrderId : '',
      api_url: job_data.api_url,
      login_api_exchangeURL: job_data.login_api_exchangeURL,
      symbol: job_data.symbol.value ? job_data.symbol.value : job_data.symbol,
      type: 'limit',
      side: job_data.side,
      amount: job_data.amount, // per cent from wallet
      spread_percent: job_data.spread_percent, // per cent of spread
      api_key: setRequiredVariable('APIKEY'),
      api_secret: setRequiredVariable('APISECRET'),
      timeStarted: job_data.timeStarted ? job_data.timeStarted : Date.now(), // total time elapsed since the task running
      timeElapsed: job_data.timeElapsed ? job_data.timeElapsed : 0, // total time elapsed since the task running
      totalVolume: job_data.totalVolume ? job_data.totalVolume : 0, // total volume made so far by this task in this pair (in base asset)
      volumeInHour: job_data.volumeInHour ? job_data.volumeInHour : 0, // volume per hour made by this task (average, instead of every hour), task continuation requirement based on this
      volumeInEachHour: job_data.volumeInEachHour ? job_data.volumeInEachHour : 0, // exact volume per hour made by this task
      fine_exchange_user_id: login_email ? login_email : job_data.fine_exchange_user_id, // unique login_id (email) of this fine exchange user (from fine exchange mainnet)
      task_unique_id: id, // to be send by front-end (unique if of the task)
      login_api_apiKey_S: job_data.login_api_apiKey_S,
      seconds_interval: job_data.seconds_interval,
      taskRunningServer: setRequiredVariable('SERVER_NAME'),
      continue: (response.data.task.taskStatus == 'running') ? _continue : false
  }
  // console.log("_obj>")
  // console.log(_obj)
  // console.log("<_obj")
  try {
    if(!(res === 1)) {
      await getOrderBook(_obj, res, job_data.login_api_apiKey_S) // Check if order book exist (because this is required to refer price spread in worker)
    }
  } catch (e: any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: getOrderBook: error: stoping_task: " + job_data.login_api_apiKey_S + " error: " + e.toString() + " error_stack: " + e.stack)
    setTaskToStop(job_data.login_api_apiKey_S, 'stopped', id)
    // TODO: change task status to stop
  }
  try {
    await addToQueue(_obj, job_data, 0)
  } catch(e: any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: addToQueue: error: stoping_task: " + job_data.login_api_apiKey_S + " error: " + e.toString() + " error_stack: " + e.stack)
    setTaskToStop(job_data.login_api_apiKey_S, 'stopped', id)
    // TODO: change task status to stop
  }
}



async function addToQueue(_obj: any, job_data: any, again: any) {
  // TODO: add to log
  try {
    await queue.add(
      'createOrder',
      _obj,
      {
        delay: parseInt(job_data.seconds_interval) * 1000,
        // jobId: id
      }
    );
  } catch (e: any) {
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: addToQueue: " + "again: " + again + ": " + _obj.login_api_apiKey_S+ " error: " + e.toString() + " error_stack: " + e.stack)
  }
}

// TODO: use 'failed' event as well to set task stopped in db from worker because here information is not proper
queueEvents.on('failed', async (job: any) => {
  // job has failed
  console.log(job)
  logger.info(setRequiredVariable('SERVER_NAME') + ": job_failed: " + JSON.stringify(job))
  const _job: any = await queue.getJob(job.jobId)
  // console.log("_job=>")
  // console.log(_job.data)
  // console.log("<=_job")
  setTaskToStop(_job.data.login_api_apiKey_S, 'stopped', _job.data.task_unique_id)
  // { jobId: '8', failedReason: "Cannot read property '0' of undefined" }
});
queueEvents.on('completed', (data: any) => {
  console.log(`${data.jobId} has completed and returned`);
  console.log(data.returnvalue) // TODO: remove this from here after it is working
  logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
  
  // TODO: calculate if it is required to continue this task or not
  // TODO: Use DB (stopped/running) to continue or not instead of these variables
  if (data.returnvalue.continue == true) {
    console.log(data.returnvalue)
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: job_repeated: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
    addJobs(data.returnvalue, data.returnvalue.fine_exchange_user_id, 1, data.returnvalue.continue, data.returnvalue.task_unique_id)
    // TODO: update db
  } else {
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: job_completed: job_not_repeated: " + data.returnvalue.login_api_apiKey_S + ": job_id: " + data.jobId + ": returned_value: " + encryptData(JSON.stringify(data.returnvalue)))
    // TODO: update db
    // log job discontinued and specify reason (by user or by system (intentionally or error))
  }
});


export {
  saveToDb
}




async function setTaskToStop(logger_key: string, status: string, id: string) {
  try {
    var url = `http://${setRequiredVariable('SERVER_DB_URL')}:${setRequiredVariable('SERVER_DB_PORT')}/delete_service`
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: setTaskToStop: called: " + logger_key + ": id: " + encryptData(id) + ": status: " + status)
    let response = await axios.post(url,
      {
        login_api_apiKey_S: logger_key,
        status: status,
        id: id
      }
    )
    console.log(response.data)
    logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: setTaskToStop: response: " + response.data.logger_key + ": " + encryptData(JSON.stringify(response.data)))
  } catch(e: any) {
      logger.info(setRequiredVariable('SERVER_NAME') + ": addJobs: setTaskToStop: error: " + logger_key + " error: " + e.toString() + " error_stack: " + e.stack)
  }
}





