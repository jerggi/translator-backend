require("babel-register")
const koa = require('koa')
const app = new koa()
const dataController = require('./api/controllers/dataController')

const router = require('./api/router')
const createRoutes = require('./api/routes')

global._ = require('lodash')

require('koa-validate')(app)
const koaBody = require('koa-body')
const responseTime = require('./api/middlewares/responseTime')

const Db = require('./data/index')
Db.load()

createRoutes(router)
router.use(responseTime())

app
  .use(koaBody({
    formidable: {
      uploadDir: './data/dictionaries'
    },
    multipart: true,
    urlencoded: true
  }))
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => console.log('server listening on port 3000'))
