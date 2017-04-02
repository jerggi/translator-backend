const ctrl = require('./controllers/mainController');
const dictionary = require('./controllers/dictionaryController');
const wordCtrl = require('./controllers/wordController');
const dataController = require('./controllers/dataController')

const createRoutes = function (router) {
    router.get('/version', async (ctx, next) => {
        ctx.body = dataController.getAppInfo()
    })

    router.get('/translate', async (ctx, next) => {
        ctx.checkQuery('word').notEmpty();
        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        ctx.body = ctrl.findTranslation(ctx.query.word, ctx.query.dicts);
    });

    // ADD WORD
    router.post('/dictionary/word', async (ctx, next) => {
        ctx.checkBody('dict').notEmpty();
        ctx.checkBody('word').notEmpty();
        ctx.checkBody('translations').notEmpty();

        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        const { dict, word, translations } = ctx.request.body;

        const result = wordCtrl.addWord(dict, word, translations);
        ctx.status = result.code;
    });

    // CHANGE WORD
    router.put('/dictionary/word', async (ctx, next) => {
        ctx.checkBody('dict').notEmpty();
        ctx.checkBody('word').notEmpty();

        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        const { dict, word, newWord, translation, newTranslation } = ctx.request.body;

        const result = wordCtrl.changeWord(dict, word, newWord, translation, newTranslation);
        ctx.status = result.code;
    })

    // DELETE WORD
    router.delete('/dictionary/word', async (ctx, next) => {
        ctx.checkBody('dict').notEmpty();
        ctx.checkBody('word').notEmpty();

        const { dict, word, translation } = ctx.params;

        const result = wordCtrl.deleteWord(dict, word, translation);
        ctx.status = result.code;

        if (result.error) {
            ctx.body = result;
        }
    })

    router.get('/dictionary', async (ctx, next) => {
        ctx.body = dictionary.allDictionaries(ctx.query.full);
    });

    router.get('/dict', async (ctx, next) => {
        ctx.body = 'you';

        dictionary.read();
    })

    router.get('/dictionary/:name', async (ctx, next) => {
        ctx.body = dictionary.getDictionaryJSON(ctx.params.name);
    });

    router.post('/dictionary/create', async (ctx, next) => {
        ctx.checkBody("name").notEmpty();
        if (ctx.errors) {
            ctx.body = ctx.errors
            ctx.status = 400
            return
        }

        const { name, data } = ctx.request.body
        let result

        try {
            ctx.body = await dictionary.createDictionary(name, data)
        } catch (err) {
            ctx.body = err
            ctx.status = err.code
        }
    })

    router.post('/file', async (ctx, next) => {
        console.log("Files: ", ctx.request.body.files);
        console.log("Fields: ", ctx.request.body.fields);

        ctx.body = "Received your data"
    });
}

module.exports = createRoutes;
