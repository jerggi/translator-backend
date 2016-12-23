const fs = require('fs')
const koa = require('koa');
const app = koa();
const router = require('./api/router');
const createRoutes = require('./api/routes');

require('koa-validate')(app);

const validator = require('koa-router-validator');
const bodyparser = require('koa-bodyparser');

const responseTime = require('./api/middlewares/responseTime');

process.on('exit', (code) => {
  console.log('Process going to exit, writing in memory data to file');
  //writeData()
});

createRoutes(router);
router.use(responseTime());

app
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods());
 
app.listen(3000);

//data['somekey'] = 'great value'

//console.log(data)
