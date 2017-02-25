const ctrl = require('./controllers/mainController');
const dictionary = require('./controllers/dictionaryController');
const wordCtrl = require('./controllers/wordController');

const createRoutes = function (router) {
    router.get('/translate', function* (next) {
        this.checkQuery('word').notEmpty();
        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
        
        this.body = ctrl.findTranslation(this.query.word, this.query.dicts);
        
        yield next;
    });

    router.post('/add-word', function* (next) {
        this.checkBody('dict').notEmpty();
        this.checkBody('word').notEmpty();
        this.checkBody('translations').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }

        const { dict, word, translations } = this.request.body;

        const result = wordCtrl.addWord(dict, word, translations);
        this.body = 'OK';
        this.status = result.code;

        yield next;
    });

    router.put('/change-word', function* (next) {
        this.checkBody('dict').notEmpty();
        this.checkBody('word').notEmpty();
        this.checkBody('newWord').notEmpty();
        this.checkBody('newTranslation').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }

        const { dict, word, newWord, newTranslation } = this.request.body;

        const result = wordCtrl.changeWord(dict, word, newWord, newTranslation);
    })

    router.put('/change-translation', function* (next) {
        this.checkBody('dict').notEmpty();
        this.checkBody('word').notEmpty();
        this.checkBody('newTranslation').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
    })

    router.delete('/delete-word', function* (next) {
        this.checkBody('dict').notEmpty();
        this.checkBody('word').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
    })

    router.get('/dictionary', function* (next) {
        this.body = dictionary.allDictionaries();

        yield next;
    });

    router.get('/dict', function* (next) {
        this.body = 'you';

        dictionary.read();

        
    })

    router.get('/dictionary/:name', function* (next) {
        this.body = dictionary.getDictionary(this.params.name);

        yield next;
    });

    router.post('/dictionary/create', function* (next) {
        //this.checkBody("name").notEmpty();
        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }

        dictionary.createDictionary(this.body.name, this.body.data);
        this.body = 'OK';
        this.status = 200;

        yield next;
    });

    router.post('/file', function* (next) {
        console.log("Files: ", this.request.body.files);
        console.log("Fields: ", this.request.body.fields);

        this.body = "Received your data"
    });
}

module.exports = createRoutes;
