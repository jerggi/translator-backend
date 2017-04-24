const low = require('lowdb')
const path = require('path')
const fs = require('fs')

const Change = require('./Change')
const Type = require('./constants')

const storagePath = path.join('data', 'dicts')
const metaPath = path.join('data', '_meta')

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

    createDictionary (name, dict) {
        const file = path.join(storagePath, `${name}.json`)
        const meta = path.join(metaPath, `_${name}.json`)
        this.data[name] = low(file)
        this.data[name].setState({ name, words: dict })
        this.meta[name] = low(meta)
        this.meta[name].setState({ revisions: [{ revision: 0, changes: null }] })
    }

    deleteDictionary (name) {
        const file = path.join(storagePath, `${name}.json`)
        const meta = path.join(metaPath, `_${name}.json`)
        delete this.data[name]
        delete this.meta[name]
        fs.unlinkSync(file)
        fs.unlinkSync(meta)
    }

    getRevision (dict) {
        const currRevision =  this.meta[dict].get('revisions').last().value()

        return currRevision.revision
    }

    getChanges (dict, revision) {
        // TODO
        return this.meta[dict].get('revisions').findLatestRevs().value()
    }

    syncDictionary (dict, revision, changes) {
        // TODO
    }

    addWord (dict, word, translation) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: new Change(Type.ADD_WORD, { word, translation }) })
            .write()
        
        this.data[dict]
            .get('words')
            .set(word, translation)
            .write()
    }

    changeWord (dict, word, newWord, newTranslation) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: new Change(Type.CHANGE_WORD, { word, newWord, translation }) })
            .write()

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
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: new Change(Type.DELETE_WORD, { word }) })
            .write()

        this.data[dict]
            .get('words')
            .unset(word)
            .write()
    }
}

module.exports = Model
