import { Request, Response } from 'express';
import { setRequiredVariable, encryptData } from '../helpers';
import logger from '../logger';
import { saveToDb } from './helpers/queue_helper';
// import { QuickDB } from 'quick.db';
// const db = QuickDB({ filePath: 'db/main.sqlite' });
const crypto = require("crypto");
// var user_task_control = new db.table('user_task_control')
const hello = async (req: Request, res: Response) => {
  return res.status(200).send("Hello")
}
const create_new = async (req: Request, res: Response) => {
  try {
    logger.info("\n\n" + setRequiredVariable('SERVER_NAME') + 'Create_New: ')
    // logging info at saveToDb after whole object is completed 
    // console.log(req.body) // should be req.body.body
    let id = crypto.randomBytes(20).toString("hex")
    
    await saveToDb(req.body.body, req.body.login_email, res, true, id)
    
    if(res.headersSent) {
      return
    }
    
    return res.status(200).send({message: '<span class="text-green">Running!</span>', status: 'running'})
  } catch (e: any) {
    console.log(e)
    logger.info(setRequiredVariable('SERVER_NAME') + 'Unexpected Error: ' + e.stack.toString())
    
    if(res.headersSent) {
      return
    }
    
    return res.status(200).json({
      'message': 'c_n_q_work: Unexpected error: ' + e.toString()
    })
  }
}


export {
  create_new,
  hello
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