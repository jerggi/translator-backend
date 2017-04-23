const translateCtrl = require('./controllers/translateController')
const dictionaryCtrl = require('./controllers/dictionaryController')
const wordCtrl = require('./controllers/wordController')
const dataController = require('./controllers/dataController')

//const testCtrl = require('./controllers/testController')

const createRoutes = function (router) {
    router.get('/version', async (ctx, next) => {
        ctx.body = dataController.getAppInfo()
    })

    router.get('/changes', async (ctx, next) => {
        ctx.body = translate.findChanges()
    })

    router.get('/translate', async (ctx, next) => {
        ctx.checkQuery('word').notEmpty()
        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        ctx.body = translateCtrl.findTranslations(ctx.query.word, ctx.query.dict)
        // ctx.body = await testCtrl.findTranslation(ctx.query.word, ctx.query.dicts);
    });

    // ADD WORD
    router.post('/dictionary/:name/word', async (ctx, next) => {
        ctx.checkBody('word').notEmpty()
        ctx.checkBody('translation').notEmpty()

        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const dict = ctx.params.name
        const { word, translation } = ctx.request.body

        const result = wordCtrl.addWord(dict, word, translation)
        ctx.status = result.code
        
        if (result.error) {
            ctx.body = result
        }
    });

    // CHANGE WORD
    router.put('/dictionary/:name/word', async (ctx, next) => {
        ctx.checkBody('word').notEmpty()
        ctx.checkBody('newTranslation').notEmpty()

        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const dict = ctx.params.name
        const { word, newWord, newTranslation } = ctx.request.body

        const result = wordCtrl.changeWord(dict, word, newWord, newTranslation)
        ctx.status = result.code

        if (result.error) {
            ctx.body = result
        }
    })

    // DELETE WORD
    router.delete('/dictionary/:name/word/:word', async (ctx, next) => {
        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const { name, word } = ctx.params

        const result = wordCtrl.deleteWord(name, word)
        ctx.status = result.code

        if (result.error) {
            ctx.body = result
        }
    })

    router.get('/dictionary', async (ctx, next) => {
        ctx.body = dictionaryCtrl.findAll()
    });

    router.get('/dictionary/:name', async (ctx, next) => {
        const result = dictionaryCtrl.findDictionary(ctx.params.name)

        if (result.error) {
            ctx.status = result.code
            ctx.body = result
        }

        ctx.body = result
    });

    router.post('/dictionary', async (ctx, next) => {
        ctx.checkBody("name").notEmpty();
        ctx.checkBody("data").notEmpty();

        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const { name, data } = ctx.request.body

        dictionaryCtrl.createDictionary(name, data)
        /*try {
            ctx.body = dictionary.createDictionary(name, data)
        } catch (err) {
            ctx.body = err
            ctx.status = err.code
        }*/
    })

    router.post('/file', async (ctx, next) => {
        console.log("Files: ", ctx.request.body.files);
        console.log("Fields: ", ctx.request.body.fields);

        ctx.body = "Received your data"
    });
    // TODO remove router
    router.get('/dictionary/create', async (ctx, next) => {
        console.log('GET DICT CREATE REQUEST')

        ctx.body = 'OK'
    })
}

module.exports = createRoutes;
