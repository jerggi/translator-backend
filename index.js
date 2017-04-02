require("babel-register")
const koa = require('koa')
const app = new koa()
const dataController = require('./api/controllers/dataController')

const router = require('./api/router')
const createRoutes = require('./api/routes')

global._ = require('lodash')

require('koa-validate')(app)

const validator = require('koa-router-validator')
const koaBody = require('koa-body')

const responseTime = require('./api/middlewares/responseTime')

process.on('exit', (code) => {
  console.log('Process going to exit, writing in memory data to file')
  //dataController.writeData()
});

createRoutes(router);
router.use(responseTime());

app
  .use(koaBody({
    formidable: {
      uploadDir: './data'
    },
    multipart: true,
    urlencoded: true
  }))
  .use(router.routes())
  .use(router.allowedMethods())

//dataController.writeData()

dataController.loadData().then(() => {
  app.listen(3000, () => console.log('server listening on port 3000'));
}).catch((err) => {
  console.error(err)
});
