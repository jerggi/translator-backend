const ctrl = require('./controllers/mainController');

const createRoutes = function (router) {
    router.get('/translation', function* (next) {
        this.checkQuery('word').notEmpty();
        this.checkQuery('dictionary').notEmpty();
        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
        
        this.body = ctrl.findTranslation(this.query.word);
        
        yield next;
    });

    router.post('/translate', function* (next) {
        this.checkBody('word').notEmpty();
        this.checkBody('translation').notEmpty();
        this.checkBody('dictionary').notEmpty();
        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
        yield next;
    });

    router.get('/dictionary', function* (next) {
        this.body = ctrl.allDictionaries();

        yield next;
    });
}

module.exports = createRoutes;
