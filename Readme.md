# ![PrexView](https://cdn.prexview.com/media/extension/promo.png)

[![Status](https://travis-ci.org/prexview/prexview-js.svg?branch=master)](https://travis-ci.org/prexview/prexview-js) [![npm version](https://badge.fury.io/js/prexview.svg)](https://npmjs.org/package/prexview "View this project on npm")

A node.js module to use PrexView a fast, scalable and very friendly service for programatic HTML, PDF, PNG or JPG generation using JSON or XML data.

*See [PrexView](https://prexview.com) for more information about the service.*


## Install

```
$ npm install --save prexview
```

## Usage

###### Set up the PXV_API_KEY as an enviroment variable

```
export PXV_API_KEY="API_KEY"
```

You can sign up in [PrexView](https://prexview.com/join) in order to get an API Key.

###### Sending XML

```js
const pxv = require('prexview')
const fs = require('fs')

const options = {
  design: 'custom-invoice',
  output: 'pdf'
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<languages>
  <lang code="en">English</lang>
  <lang code="es">Español</lang>
  <lang code="fr">Française</lang>
</languages>`

pxv.sendXML(xml, options, (err, res)=>{
  if(err) return console.log(err)
  fs.writeFile('file.pdf', res.file, (err)=>{
    console.log(`Completed with id ${res.id}`)
  })
})
```

###### Sending JSON

You can pass the json param as a valid json string or as a  javascript object

```js
const pxv = require('prexview')
const fs = require('fs')

const options = {
  design: 'custom-invoice',
  output: 'pdf'
}

const json = `{
  "languages": {
    "en": "English",
    "es": "Español",
    "fr": "Française"
  }
}`

pxv.sendJSON(json, options, (err, res)=>{
  if(err) return console.log(err)
  fs.writeFile('file.pdf', res.file, (err)=>{
    console.log(`Completed with id ${res.id}`)
  })
})
```



## API

### sendXML(xml, options, callback)

Send data as a XML string

### sendJSON(json, options, callback)

Send data as a JSON string, it can also be can be a valid JSON string or a javascript object

#### options

##### design

Type: `string` 
Required: Yes

Name of the design to use.

##### output

Type: `string` 
Required: Yes

The format we want to receive from the service, it can be **html**, **pdf**, **png** or **jpg**

##### designBackup

Type: `string`

Name of another design to use if the option **design** is not available in the service

##### note

Type: `string`

A custom note to add any string limit to 500 chars. It's usefull if you want to add meta data like a document, transaction or customer id.

## License

MIT © [PrexView](https://prexview.com)
