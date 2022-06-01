import { Request, Response } from 'express';
import axios from 'axios'
import { setRequiredVariable, getUserDetails } from '../helpers';
import logger from '../logger';
import { addJobs } from './helpers/queue_helper';
// import { QuickDB } from 'quick.db';
// const db = QuickDB({ filePath: 'db/main.sqlite' });

// var user_task_control = new db.table('user_task_control')

const my_services = async (req: Request, res: Response) => {
  try {
    console.log('services')
    logger.info("my_services: " + JSON.stringify(req.body))
    return res.status(200).send('data412523523412')
  } catch (e: any) {
    logger.error('Unexpected Error: ' + e.toString())
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }

}

const create_new = async (req: Request, res: Response) => {
  try {
    // let add_jobs = addJobs(req.body)
    console.log(req.body) // should be req.body.body
    logger.info("create_new: " + JSON.stringify(req.body))
    // var user_details = await getUserDetails(
    //   req.body.body.api_key,
    //   req.body.body.api_secret,
    //   req.body.body.api_url
    // )

    // console.log(user_details)
    // user_task_control.set(`${user_details.email}.id`, user_details.id)

    // console.log(user_details)
    // console.log('DB all')
    // console.log(user_task_control.all())
    // console.log(user_task_control.get(user_details.email))
    // <Result>
    // console.log(req.body.body)
    // {
    //   unique_id: 'b24f29c9-dc65-4167-9833-e3f160d85503',
    //     api_url: 'https://api.fine.exchange',
    //       api_key: 'a83849471ef22435094d1536d3287ad14c691cc3',
    //         api_secret: 'a58873f24e1804672d9fbfc4829b7c9a856eb60ed1b8148a32',
    //           'task_data_type_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': 'buy',
    //             'task_data_api_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': {
    //     label: 'first api testing',
    //       url: 'https://api.fine.exchange',
    //         description: 'Fine Exchange Mainnet',
    //           api_key: '룪⸈굫왞䆤⩇წ㦨僮䡅錟ֱ뮬龉짰䂻ʃጡ뢼崢滫♊棿겻◬홱擗\uda50ವ壋䆄\udbb8F鈮輁韒ؙ聣뫕ቯ۶䁬ﭐ',
    //             api_secret: '룪⸅굠왝䆮⨕ჩ㦨傹䡏錝ֱ뮩龋짲䃦ʎ፲룯嵲滩☖棾결▶홱擕\uda0d೥壇䇒\udbb8\x1A鉽轔鞁ُ芖䢄⠟鿠ꅠ췚⇦䨗蹞㿚᐀奱私롛㉪',
    //               api_update_date: '12/05/2022, 08:13:09'
    //   },
    //   'task_data_pair_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': { label: 'ETH/USDT', value: 'ETH/USDT' },
    //   'task_data_interval_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': '1313',
    //   'task_data_spread_percent_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': '1',
    //   'task_data_state_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': 'stopped',
    //   'task_data_date_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': '22/05/2022, 15:02:10',
    //   'task_data_amount_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': '3',
    //   'task_data_id_plain_pretext_b24f29c9-dc65-4167-9833-e3f160d85503': 'b24f29c9-dc65-4167-9833-e3f160d85503'
    // }
    // </Result>

    // logger.info("create_new: addJobs: " + add_jobs)
    // console.log(JSON.stringify(req.body))
    // {"body":{"task_data_type_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"sell","task_data_api_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":{"label":"first api testing","url":"https://api.fine.exchange","description":"Fine Exchange Mainnet","api_key":"룪⸈굫왞䆤⩇წ㦨僮䡅錟ֱ뮬龉짰䂻ʃጡ뢼崢滫♊棿겻◬홱擗\uda50ವ壋䆄\udbb8F鈮輁韒ؙ聣뫕ቯ۶䁬ﭐ","api_secret":"룪⸅굠왝䆮⨕ჩ㦨傹䡏錝ֱ뮩龋짲䃦ʎ፲룯嵲滩☖棾결▶홱擕\uda0d೥壇䇒\udbb8\u001a鉽轔鞁ُ芖䢄⠟鿠ꅠ췚⇦䨗蹞㿚᐀奱私롛㉪","api_update_date":"12/05/2022, 08:13:09"},"task_data_pair_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":{"label":"BTC/USDT","value":"BTC/USDT"},"task_data_interval_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"555","task_data_spread_percent_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"1","task_data_state_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"stopped","task_data_date_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"13/05/2022, 15:25:50","task_data_amount_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"14","task_data_id_plain_pretext_592fb5ab-d1dd-448f-8585-d45cd2fbb52f":"0","api_key":"a83849471ef22435094d1536d3287ad14c691cc3","api_secret":"a58873f24e1804672d9fbfc4829b7c9a856eb60ed1b8148a32"}}
    return res.status(200).send({message: '<span class="text-green">Running!</span>'})
  } catch (e: any) {
    console.log(e.message)
    logger.error('Unexpected Error: ' + e.toString())
    return res.status(500).json({
      'message': 'Unexpected error'
    })
  }
}


export {
  my_services,
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