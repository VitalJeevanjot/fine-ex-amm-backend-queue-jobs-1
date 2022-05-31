import { Worker } from 'bullmq';
import ccxt from 'ccxt';

import { setRequiredVariable } from './helpers';




async function main () {
  console.log('up!')
  // for better make 2 workers with 2 loggins, One for 'buying' and one for 'selling'
  // <...Testing...> 
  var obj: any = {
    urls:
    {
      api:
      {
        rest:
          "https://api.fine.exchange"
      }
    }
  }
  const exchange: any = new ccxt.hollaex(obj)
  exchange.apiKey = setRequiredVariable('APIKEY')
  exchange.secret = setRequiredVariable('APISECRET')
  console.log(await exchange.fetchStatus())


  // console.log(await exchange.fetchAccounts())
  // console.log(await exchange.fetchOrderBook('XHT/USDT', 5))
  // console.log(await exchange.fetchOrderBook('XHT/USDT', 5))
  // console.log(await exchange.has)

  // var get_balance = await exchange.fetchBalance()

  // console.log(get_balance)

  // </...Testing...>

  // <...Testing...>
  // let orderId = await exchange.createOrder(
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.14'
  // )

  // console.log('orderID')
  // console.log(orderId)

  // let editOrder = await exchange.editOrder(
  //   orderId.id,
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.13'
  // )
  // console.log('Edited Order ID')
  // console.log(editOrder)

  // let edit_again_Order = await exchange.editOrder(
  //   editOrder.id,
  //   'XHT/USDT',
  //   'limit',
  //   'buy',
  //   '10',
  //   '0.12'
  // )
  // console.log('Edited again Order ID')
  // console.log(edit_again_Order)
  // </...Testing...>


  const worker = new Worker('tasks', async job => {
    var obj: any = {
      urls:
      {
        api:
        {
          rest:
            job.data.exchange_url
        }
      }
    }

    const exchange: any = new ccxt.hollaex(obj)
    // for better make 2 workers with 2 loggins, One for 'buying' and one for 'selling'
    exchange.apiKey = job.data.api_key
    exchange.secret = job.data.api_secret

    let get_side = job.data.side
    let get_symbol = job.data.symbol.split('/') // base/quote currency
    let get_orderbook = await exchange.fetchOrderBook(job.data.symbol, 5)
    let top_bid_ask = (get_side === 'buy') ?
      get_orderbook.bids[0][0] : get_orderbook.asks[0][0]  // price of 1st from bids : asks
    let calculate_price_spread = (get_side === 'buy') ? top_bid_ask - (top_bid_ask / 100 * 5) : top_bid_ask + (top_bid_ask / 100 * 5)
    var get_balance = await exchange.fetchBalance()
    // (for my exchange) the percentage of amount used is base currency, to buy/sell quote
    let calculated_amount = (get_balance[get_symbol[0]]['free'] / 100) * job.data.price
    if (job.data.order_id === '') {
      let orderId = await exchange.createOrder(
        job.data.symbol,
        job.data.type,
        get_side,
        calculated_amount,
        calculate_price_spread
      )
      console.log("----new order----")
      console.log(orderId)
      return {
        order_id: orderId.id,
        exchange_url: job.data.exchange_url,
        symbol: job.data.symbol,
        type: job.data.type,
        side: job.data.side,
        amount: job.data.amount,
        price: job.data.price,
        api_key: job.data.api_key,
        api_secret: job.data.api_secret,
        continue: true
      }
    } else {
      let editOrder = await exchange.editOrder(
        job.data.order_id,
        job.data.symbol,
        job.data.type,
        get_side,
        calculated_amount,
        calculate_price_spread
      )
      console.log("----edit order----")
      console.log(editOrder)
      return {
        order_id: editOrder.id,
        exchange_url: job.data.exchange_url,
        symbol: job.data.symbol,
        type: job.data.type,
        side: job.data.side,
        amount: job.data.amount,
        price: job.data.price,
        api_key: job.data.api_key,
        api_secret: job.data.api_secret,
        continue: true
      }
    }
  }, {
    concurrency: 10000,
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  })

  var i = 0;

  // worker.on('resumed', () => {
  //   console.log('active!')
  // })

  worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`)
    var current = new Date();
    console.log(current)
  })

  worker.on('completed', job => {
    console.log(`${job.id} has completed`)
    i++
    console.log(i)
  })
}
main()