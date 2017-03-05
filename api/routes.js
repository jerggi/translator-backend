const ctrl = require('./controllers/mainController');
const dictionary = require('./controllers/dictionaryController');
const wordCtrl = require('./controllers/wordController');

const createRoutes = function (router) {
    router.get('/test', async (ctx, next) => {
        ctx.body = 'test';
    });

    router.get('/translate', async (ctx, next) => {
        ctx.checkQuery('word').notEmpty();
        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        ctx.body = ctrl.findTranslation(ctx.query.word, ctx.query.dicts);
    });

    router.post('/add-word', async (ctx, next) => {
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

    router.put('/change-word', async (ctx, next) => {
        ctx.checkBody('dict').notEmpty();
        ctx.checkBody('word').notEmpty();
        ctx.checkBody('newWord').notEmpty();
        ctx.checkBody('newTranslations').notEmpty();

        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        const { dict, word, newWord, newTranslations } = ctx.request.body;

        const result = wordCtrl.changeWord(dict, word, newWord, newTranslations);
        ctx.status = result.code;
    })

    router.put('/change-translation', async (ctx, next) => {
        ctx.checkBody('dict').notEmpty();
        ctx.checkBody('word').notEmpty();
        ctx.checkBody('newTranslations').notEmpty();

        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        const { dict, word, newTranslations } = ctx.request.body;

        const result = wordCtrl.changeTranslations(dict, word, newTranslations);
        ctx.status = result.code;
    })

    router.delete('/delete-word/:dict/:word', async (ctx, next) => {
        const { dict, word } = ctx.params;

        const result = wordCtrl.deleteWord(dict, word);
        ctx.status = result.code;

        if (result.error) {
            ctx.body = result;
            ctx.status = result.code;
        }
    })

    router.get('/dictionary', async (ctx, next) => {
        ctx.body = dictionary.allDictionaries();
    });

    router.get('/dict', async (ctx, next) => {
        ctx.body = 'you';

        dictionary.read();
    })

    router.get('/dictionary/:name', async (ctx, next) => {
        ctx.body = dictionary.getDictionary(ctx.params.name);
    });

    router.post('/dictionary/create', async (ctx, next) => {
        //ctx.checkBody("name").notEmpty();
        if (ctx.errors) {
            ctx.body = ctx.errors;
            ctx.status = 400;
            return;
        }

        dictionary.createDictionary(ctx.body.name, ctx.body.data);
        ctx.body = 'OK';
        ctx.status = 200;
    });

    router.post('/file', async (ctx, next) => {
        console.log("Files: ", ctx.request.body.files);
        console.log("Fields: ", ctx.request.body.fields);

        ctx.body = "Received your data"
    });
}

module.exports = createRoutes;
