const translateCtrl = require('./controllers/translateController')
const dictionaryCtrl = require('./controllers/dictionaryController')
const wordCtrl = require('./controllers/wordController')
const dataController = require('./controllers/dataController')

const createRoutes = function (router) {
    router.get('/version', async (ctx, next) => {
        ctx.body = dataController.getAppInfo()
    })

    router.get('/translate', async (ctx, next) => {
        ctx.checkQuery('word').notEmpty()
        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        ctx.body = translateCtrl.findTranslations(ctx.query.word, ctx.query.dict)
    })

    // add word
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
    })

    // change word
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

    // delete word
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

    // get list of dictionaries
    router.get('/dictionary', async (ctx, next) => {
        ctx.body = dictionaryCtrl.findAll()
    })

    // get dictionary
    router.get('/dictionary/:name', async (ctx, next) => {
        const result = dictionaryCtrl.findDictionary(ctx.params.name)

        if (result.error) {
            ctx.status = result.code
            ctx.body = result
        }

        ctx.body = result
    })

    // create new dictionary
    router.post('/dictionary', async (ctx, next) => {
        ctx.checkBody("name").notEmpty()

        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const { name, data } = ctx.request.body

        const result = dictionaryCtrl.createDictionary(name, data)

        ctx.status = result.code
        
        if (result.error) {
            ctx.body = result
        }
    })

    router.delete('/dictionary/:name', async (ctx, next) => {
        const result = dictionaryCtrl.deleteDictionary(ctx.params.name)

        ctx.status = result.code
        
        if (result.error) {
            ctx.body = result
        }
    })

    router.post('/file', async (ctx, next) => {
        console.log("Files: ", ctx.request.body.files)
        console.log("Fields: ", ctx.request.body.fields)

        ctx.body = "Received your data"
    })
}

module.exports = createRoutes
