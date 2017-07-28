const Request = require('superagent')

const URL = 'https://api.prexview.com/v1/'
let token = process.env.PXV_API_KEY || ''

const send = (options) => {
  return Request
    .post(URL + 'transform')
    .set('Authorization', token)
    .buffer(true)
    .parse((res, fn) => {
      let data = []

      res.on('data', (chunk) => {
        data.push(chunk)
      })

      res.on('end', () => {
        fn(null, Buffer.concat(data))
      })
    })
    .send(options)
    .then((res) => {
      if (!res.ok) {
        throw new Error('PrexView could not create document, response status: ' . res.status_code)
      }

      let result = {
        rateLimit: res.headers['x-ratelimit-limit'],
        rateLimitReset: res.headers['x-ratelimit-reset'],
        rateRemaining: res.headers['x-ratelimit-remaining']
      }

      if(res.status === 200){
        result.id = res.headers['x-transaction-id']
        result.file = res.body
        result.responseTime = res.headers['x-response-time']
      }

      return result
    })
    .catch((err) => {
      throw new Error('PrexView could not create document, response status: ' + err.status)
    })
}

const isJson = (str) => {
  try {
    JSON.parse(str)
  } catch(e) {
    return false
  }

  return true
}

const checkOptions = (format, options) => {
  // JSON
  if (format === 'json') {
    if (typeof options.json === 'string') {
      if (!isJson(options.json)) {
        throw new Error('PrexView content must be a valid JSON string')
      }
    } else {
      if (options.json === null || typeof options.json !== 'object') {
        throw new Error('PrexView content must be a javascript object or a valid JSON string')
      } else {
        options.json = JSON.stringify(options.json)
      }
    }
  // XML
  } else {
    if (typeof options.xml !== 'string') {
      throw new Error('PrexView content must be a valid XML string')
    }
  }

  // TODO: design option is deprecated, this should be removed
  if (options.design) {
    console.info('PrexView property "design" is deprecated, please use "template" property.')
    options.template = options.design

    delete options.design
  }

  if (typeof options.template !== 'string')
    throw new Error('PrexView property "template" must be passed as a string option')

  if (typeof options.output !== 'string')
    throw new Error('PrexView property "output" must be passed as a string option')

  if (['html','pdf','png','jpg'].indexOf(options.output) === -1)
    throw new Error('PrexView property "output" must be one of these options: html, pdf, png or jpg')

  // TODO: designBackup option is deprecated, this should be removed
  if (options.designBackup) {
    console.info('PrexView property "designBackup" is deprecated, please use "templateBackup" property.')
    options.templateBackup = options.designBackup
    delete options.designBackup
  }

  if (options.templateBackup && typeof options.templateBackup !== 'string')
    throw new Error('PrexView property "templateBackup" must be a string')

  if (options.note && typeof options.note !== 'string')
    throw new Error('PrexView property "note" must be a string')

  if (options.note && options.note.length > 500)
    options.note = options.note.slice(0, 500)

  return options
}

const checkToken = () => {
  if(token === '') throw new Error('PrexView environment variable PXV_API_KEY must be set')
}

class PrexView {

  constructor(api_key = null) {
    if (api_key) token = api_key
  }

  sendXML(content, options) {
    return new Promise((resolve, reject) => {
      checkToken()

      options.xml = content

      const result = checkOptions('xml', options)

      send(result)
        .then(resolve)
        .catch(reject)
    })
  }

  sendJSON(content, options) {
    return new Promise((resolve, reject) => {
      checkToken()

      options.json = content

      const result = checkOptions('json', options)

      send(result)
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = PrexView
