const low = require('lowdb')
//let db = low('dictionaries.json')
//let meta = low('meta.json')

class Model {
    constructor(dictionaries, meta) {
        this.data = dictionaries
        this.meta = meta
    }

    getDictList () {
        return _.keys(this.data)
    }

    test (dict) {
        return this.data[dict].get('words').value()
    }

    // move logic to controller
    findTranslations (dict) {
        return this.data[dict].get('neviemus')
    }

    findChanges (dict) {
        return this.meta[dict].get('neviemus')
    }

    findDictionary (dict) {
        return this.data[dict] ? this.data[dict].getState() : null
    }

    findDictionaries (dictList) {
        let dicts = _.keys(this.data)
        dicts = dictList ? dicts.filter(dict => dictList.includes(dict)) : dicts

        return _.map(dicts, dict => this.data[dict].getState())
    }

    hasDictionary (dict) {
        return this.data[dict] !== undefined
    }

    createDictionary (name, data) {

    }

    addWord (dict, word, translation) {
        this.data[dict]
            .get('words')
            .set(word, translation)
            .write()
    }

    changeWord (dict, word, newWord, newTranslation) {
        if (newWord && newWord !== word) {
            this.data[dict]
                .get('words')
                .set(newWord, newTranslation)
                .unset(word)
                .write()
        } else {
            this.data[dict]
                .get('words')
                .set(word, newTranslation)
                .write()
        }
    }

    deleteWord (dict, word) {
        this.data[dict]
            .get('words')
            .unset(word)
            .write()
    }
}

module.exports = Model
