const fs: any = require('fs')
const path: any = require('path')

import axios from 'axios';
const crypto = require('crypto')

require('dotenv').config({ path: __dirname + '/.env' })

const setRequiredVariable = (variableName: string) => {
  if (process.env[variableName]) {
    return process.env[variableName];
  }
  throw new Error(`ENV-variable missing: ${variableName}`);
}

const getUserDetails = async (api_key: string, api_secret: string, api_url: string) => {
  // ${METHOD}${PATH}${api-expires}
  const expireTime = Date.now() + 5000
  const text = `GET/v2/user${expireTime}`
  const key = api_secret

  const sig = crypto.createHmac('sha256', key)
    .update(text)
    .digest('hex')

  try {
    var res = await axios({
      method: 'GET',
      url: api_url + '/v2/user',
      headers: {
        'api-key': api_key,
        'api-signature': sig,
        'api-expires': expireTime
      }
    })
  } catch (e: any) {
    return { code: e.code, ...e.response }
  }
  return res.data
}

export {
  setRequiredVariable,
  getUserDetails
}