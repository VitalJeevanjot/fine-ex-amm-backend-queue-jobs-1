import express from 'express';
import logger from './logger';
import * as queueController from './controller/queueController'
import axios from 'axios'

const app = express();

var port = process.env.PORT || 8080;

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', queueController.say_hello)
app.get('/my_services', queueController.my_services)
app.post('/create_new', queueController.create_new)

app.listen(port, () => logger.info(`Running at ${port}!`))

// axios.get('http://dev-db-backend-fine-ex-mmm.fine-ex-genievot.svc.cluster.local:8080/my_services')
// .then((res) => {
//   console.log(res.data)
// }).catch((e) => {
//   console.log(e)
// })

