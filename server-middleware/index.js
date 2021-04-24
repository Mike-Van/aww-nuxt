const puppeteer = require('puppeteer')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const {GQL} = require('fetchier')

const app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname + '/static'))

app.all('/', async (req, res) => {
  const testUA = checkUA(req)
  const isBrowser = Object.keys(testUA).length

  if(isBrowser)
    return res.redirect(`https://dev.forms.bloo.io/f/${req.query.fid}`)

  let data = {
    id: 'something',
    title: 'Unknown title',
    description: 'Unknown description'
  }

  let form = await GQL({
    url: 'https://api-dev.bloo.io/graphql', query: `
      {
        formQueries {
          form(id: "${req.query.fid}") {
            id title description imageURL snapshotURL
          }
        }
      }
    `
  }).then(({formQueries: {form: oldForm}}) => {
    // console.log('fetched', oldForm)
    return {
      ...oldForm,
      title: oldForm?.title || data.title,
      description: oldForm?.description?.replace(/<\/?[^>]+(>|$)/g, '') || data.description
    }
  }).catch(e => {
    console.error('failed to fetched data', e)
    return data
  })

  // console.log('final', form)

  if(!fs.existsSync(`static/${req.query.fid}.png`)) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browser.newPage()

    await page.goto(`https://dev.forms.bloo.io/f/${req.query.fid}`, {
      waitUntil: 'networkidle2',
    })
    
    await new Promise(res => setTimeout(() => res(), 2000))
    
    await page.screenshot({path: `static/${req.query.fid}.jpg`})
    await browser.close()
  }

  // console.log('image path', `${req.protocol}://${req.hostname}/${req.query.fid}.jpg`)

  res.send(`
    <!doctype html>

    <head>
      <title>${form.title}</title>
      <meta data-n-head="ssr" charset="utf-8">
      <meta data-n-head="ssr" name="viewport" content="width=device-width, initial-scale=1">
      <meta data-n-head="ssr" data-hid="description" name="description" content="${form.description}">
      <meta data-n-head="ssr" data-hid="charset" charset="utf-8">
      <meta data-n-head="ssr" data-hid="mobile-web-app-capable" name="mobile-web-app-capable" content="yes">
      <meta data-n-head="ssr" data-hid="apple-mobile-web-app-title" name="apple-mobile-web-app-title" content="aww-nuxt-app">
      <meta data-n-head="ssr" data-hid="og:title" property="og:title" content="${form.title}">
      <meta data-n-head="ssr" data-hid="og:description" property="og:description" content="${form.description}">
      <meta data-n-head="ssr" data-hid="og:site_name" property="og:site_name" content="Bloo Forms">
      <meta data-n-head="ssr" data-hid="og:type" property="og:type" content="article">
      <meta data-n-head="ssr" data-hid="og:image:height" property="og:image:height" content="630">
      <meta data-n-head="ssr" data-hid="og:image:width" property="og:image:width" content="1200">
      <meta data-n-head="ssr" data-hid="og:image" property="og:image" content="${req.protocol}://${req.hostname}/${req.query.fid}.jpg">
    </head>
  `)
})

function checkUA(request) {
  let ua = request.headers['user-agent'], $ = {};
  console.log('checkUA', ua)

  if (/mobile/i.test(ua))
      $.Mobile = true;

  if (/like Mac OS X/.test(ua)) {
      $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
      $.iPhone = /iPhone/.test(ua);
      $.iPad = /iPad/.test(ua);
  }

  if (/Android/.test(ua))
      $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

  if (/webOS\//.test(ua))
      $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

  if (/(Intel|PPC) Mac OS X/.test(ua))
      $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

  if (/Windows NT/.test(ua) && !/Preview/.test(ua))
      $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

  return $
}

module.exports = app