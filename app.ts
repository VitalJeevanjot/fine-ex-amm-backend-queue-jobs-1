import express from 'express';
import logger from './logger';
import * as queueController from './controller/serverRequestController'

const app = express();

var port = 8080;

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/hello', queueController.hello)
app.post('/create_new_task', queueController.create_new)
app.post('/stop_task', queueController.create_new)
app.post('/delete_task', queueController.create_new)

app.listen(port, () => logger.info(`Running at ${port}!`))

// axios.get('http://dev-db-backend-fine-ex-mmm.fine-ex-genievot.svc.cluster.local:8080/my_services')
// .then((res) => {
//   console.log(res.data)
// }).catch((e) => {
//   console.log(e)
// })

