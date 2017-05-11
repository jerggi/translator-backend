const low = require('lowdb')
const path = require('path')
const fs = require('fs')

const Type = require('./constants')
const mixins = require('./mixins')

const storagePath = path.join('data', 'dicts')
const metaPath = path.join('data', '_meta')

class Model {
    constructor(dictionaries, meta) {
        this.data = dictionaries
        this.meta = meta
    }

    getDictList () {
        return _.map(this.data, dict => {
            const name = dict.get('name').value()
            const currRevision = this.meta[name] ? this.meta[name].get('revisions').last().value() : 1

            return {
                name,
                revision: currRevision.revision
            }
        })
    }

    test (dict) {
        return this.data[dict].get('words').value()
    }

    // move logic to controller
    findTranslations (dict) {
        return this.data[dict].get('neviemus')
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
        this.meta[name] = mixins(low(meta))
        this.meta[name].setState({ revisions: [{ revision: 1, changes: null }] })
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

    getOldestRevision (dict) {
        const oldestRevision = this.meta[dict].get('revisions').first().value()

        return oldestRevision.revision
    }

    getChanges (dict, revision) {
        if (this.getOldestRevision(dict) > revision) {
            return null
        }

        return this.meta[dict].get('revisions').findLatestChanges(revision).value()
    }

    addChanges (dict, revision, changes) {
        _.forEach(changes, c => {
            if (c.type === Type.ADD_WORD && c.word && c.translation) {
                this.addWord(dict, c.word, c.translation)
            } else if (c.type === Type.CHANGE_WORD && c.word && c.translation) {
                this.changeWord(dict, c.word, c.newWord, c.translation)
            } else if (c.type === Type.DELETE_WORD && c.word) {
                this.deleteWord(dict, c.word)
            }
        })
    }

    addWord (dict, word, translation) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: { type: Type.ADD_WORD, word, translation } })
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
            .push({ revision: currRevision + 1, changes: { type: Type.CHANGE_WORD, word, newWord: newWord ? newWord : '' , translation: newTranslation } })
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
            .push({ revision: currRevision + 1, changes: { type: Type.DELETE_WORD, word } })
            .write()

        this.data[dict]
            .get('words')
            .unset(word)
            .write()
    }
}

module.exports = Model
