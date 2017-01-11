const Request = require('superagent')

let token = process.env.PXV_API_KEY || ''
//const url = 'https://api.prexview.com/v1/'
const url = 'http://localhost:4000/v1/'

const send = (options, cb)=>{
  Request
    .post(url + 'transform')
    .set('Authorization', token)
    .buffer(true)
      .parse((res, fn)=>{
        let data = []
        res.on('data', function(chunk){
          data.push(chunk)
        })
        res.on('end', function () {
          fn(null, Buffer.concat(data))
        })
      })
    .send(options)
    .end((err, res)=>{
      if(err) return cb(err)
      const headers = res.headers
      let result = {
        rateLimit: headers['x-ratelimit-limit'],
        rateLimitReset: headers['x-ratelimit-reset'],
        rateLimit: headers['x-ratelimit-limit']
      }
      if(res.status === 200){
        result.file = res.body
        result.responseTime = headers['x-response-time']
        result.id = headers['x-transaction-id']
      }
      cb(null, result)
    })
}

const checkToken = ()=> {
  if(token === '')
    throw new Error("PrexView environment variable PXV_API_KEY must be set")
}

const isJson = (str)=> {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const checkOptions = (format, options)=> {

  // JSON
  if(format === 'json'){
    if(typeof options.json === 'string'){
      if(!isJson(options.json)){
        return 'PrexView content must be a valid JSON string'
      }
    } else {
      if(options.json === null || typeof options.json !== 'object'){
        return 'PrexView content must be a javascript object or a valid JSON string'
      }
    }
  // XML
  } else {
    if(typeof options.xml !== 'string'){
      return 'PrexView content must be a valid XML string'
    }
  }

  if(typeof options.design !== 'string') 
    return 'PrexView property "design" must be passed as a string option'
  
  if(typeof options.output !== 'string') 
    return 'PrexView property "output" must be passed as a string option'

  if(['html','pdf','png','jpg'].indexOf(options.output) === -1) 
    return 'PrexView property "output" must be one of these options: html, pdf, png or jpg'

  if(options.designBackup && typeof options.designBackup !== 'string') 
    return 'PrexView property "designBackup" must be a string'

  if(options.note && typeof options.note !== 'string') 
    return 'PrexView property "note" must be a string'

  if(options.note && options.note.length > 500) 
    options.note = options.note.slice(0, 500) 

  return options
}

class pxv {  
  static sendXML(content, options, cb){
    checkToken()
    options.xml = content
    const result = checkOptions('xml', options)

    if(typeof result === 'string')
      cb(new Error(result))
    else
      send(result, cb)
  }

  static sendJSON(content, options, cb){
    checkToken()
    options.json = content
    const result = checkOptions('json', options)
  
    if(typeof result === 'string')
      cb(new Error(result))
    else
      send(result, cb)
  }
}

module.exports = pxv
