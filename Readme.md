# PrexView

PrexView a fast, scalable and very friendly service for programatic HTML, PDF, PNG or JPG generation using JSON or XML data.

# ![PrexView](https://prexview.com/media/extension/promo.png)

[![Status](https://travis-ci.org/prexview/prexview-js.svg?branch=master)](https://travis-ci.org/prexview/prexview-js) [![npm version](https://badge.fury.io/js/prexview.svg)](https://npmjs.org/package/prexview "View this project on npm")

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

You can get an API Key by downloading PrexView Studio from [PrexView](https://prexview.com).

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

You can pass the json param as a valid json string or as a javascript object

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

#### Options

<div class="clear">&nbsp;</div>

##### -\-format

###### Type: `string` **Required: Yes**

Data to use for the document creation, must be xml or json.

<div class="clear">&nbsp;</div>

##### -\-design

###### Type: `string` **Required: Yes**

Design's name to use.

You can use json sintax here to access data and have dynamic design names
```json
{
  "Data": {
    "customer": "123"
  }
}
```
Design name can use any data attribute or text node
```
invoice-customer-{{Data.customer}}
```
We will translate that to the following
```
invoice-customer-123
```

And finally the service will try to find the design **invoice-customer-123** in order to transform the data and generate the document.
  
##### -\-output

###### Type: `string` **Required: Yes**

Document response type from the service, it can be **html**, **pdf**, **png** or **jpg**.

##### -\-design-backup

###### Type: `string`

Design's name to use to be used if the option **design** is not available in the service.

##### -\-note

###### Type: `string`

Custom note that can be used to add any information, it's limit up to 500 chars. This is useful if you want to add metadata such as document, transaction or customer ID.

You can use json syntax to access data and get dynamic notes. 
  
```json
{
  "Data": {
    "customer": "123"
  }
}
```
Notes can use any data attribute or text
```
Document: Invoice
Customer: {{Data.customer}}
```
We will translate that to the following
```
Document: Invoice
Customer: 123
```


## License

MIT © [PrexView](https://prexview.com)
