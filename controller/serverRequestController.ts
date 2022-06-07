import { Request, Response } from 'express';
import axios from 'axios'
import { setRequiredVariable, encryptData } from '../helpers';
import logger from '../logger';
import { addJobs } from './helpers/queue_helper';
// import { QuickDB } from 'quick.db';
// const db = QuickDB({ filePath: 'db/main.sqlite' });

// var user_task_control = new db.table('user_task_control')

const create_new = async (req: Request, res: Response) => {
  try {
    console.log(req.body) // should be req.body.body
    logger.info(setRequiredVariable('SERVER_NAME') + ": create_new: " + req.body.body.login_api_apiKey_S.toString() + ": " + encryptData(JSON.stringify(req.body)))
    let add_jobs = addJobs(req.body.body, req.body.login_email)

    return res.status(200).send({message: '<span class="text-green">Running!</span>'})
  } catch (e: any) {
    console.log(e.message)
    logger.info(setRequiredVariable('SERVER_NAME') + 'Unexpected Error: ' + e.stack.toString())
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }
}


export {
  create_new
}


// Testing...

// function testRun() {
//   var constructPostObj = {
//     api_key: setRequiredVariable('APIKEY'),
//     api_secret: setRequiredVariable('APISECRET'),
//     api_url: setRequiredVariable('APIURL')
//   }
//   axios.post("http://localhost:3000/create_new", {
//         body: constructPostObj
//   }).then((res: any) => {
//     console.log(res.data)
//   }).catch((e: any) => {
//     console.log(e.response.data)
//     console.log(e.message)
//   })
// }
// testRun()