import {GQL} from 'fetchier'

const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json())
app.all('/json', async (req, res) => {
  console.log('req', req.body.url)
  let {formQueries: {form}} = await GQL({
    url: 'https://api-dev.bloo.io/graphql', query: `
      {
        formQueries {
          form(id: "${req.body.url}") {
            id title description
          }
        }
      }
    `
  })
  res.json({...form, generatedUrl: `https://f.bloo.io/${req.body.url}`})
})

module.exports = app