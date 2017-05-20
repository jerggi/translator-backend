const low = require('lowdb')
const path = require('path')
const fs = require('fs')

const Type = require('./constants')
const mixins = require('./mixins')

const storagePath = path.join('data', 'dictionaries')
const metaPath = path.join('data', '_meta')

class Model {
    constructor(dictionaries, meta) {
        this.data = dictionaries
        this.meta = meta
    }

    getDictList () {
        return _.map(this.data, dict => {
            const obj = dict.getState()
            const currRevision = this.meta[obj.name] ? this.meta[obj.name].get('revisions').last().value() : 1

            return {
                name: obj.name,
                revision: currRevision.revision,
                wordCount: obj.wordCount,
                createdAt: obj.createdAt,
                lastEditedAt: obj.lastEditedAt,
            }
        })
    }

    test (dict) {
        return this.data[dict].get('words').value()
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

    createDictionary (name, words, wordCount) {
        const file = path.join(storagePath, `${name}.json`)
        const meta = path.join(metaPath, `_${name}.json`)
        const date = Date.now()
        this.data[name] = low(file)
        this.data[name].setState({ name, words, createdAt: date, lastEditedAt: date, wordCount })
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

    getWordCount (dict) {
        return this.data[dict].get('wordCount').value()
    }

    setParams (dict, params) {
        const date = Date.now()

        this.data[dict]
            .set('wordCount', params.wordCount)
            .set('lastEditedAt', date)
            .write()
    }

    addWord (dict, word, translation, mergedTranslation) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: { type: Type.ADD, word, translation } })
            .removeOldChanges()
            .write()
        
        this.data[dict]
            .get('words')
            .set(word, mergedTranslation ? mergedTranslation : translation)
            .write()
    }

    changeWord (dict, word, newWord, newTranslation, mergedTranslation) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: { type: Type.DELETE, word } })
            .push({ revision: currRevision + 2, changes: { type: Type.ADD, word: newWord ? newWord : word, translation: newTranslation } })
            .removeOldChanges()
            .write()

        if (newWord && newWord !== word) {
            this.data[dict]
                .get('words')
                .set(newWord, mergedTranslation ? mergedTranslation : newTranslation)
                .unset(word)
                .write()
        } else {
            this.data[dict]
                .get('words')
                .set(word, mergedTranslation ? mergedTranslation : newTranslation)
                .write()
        }
    }

    deleteWord (dict, word) {
        const currRevision = this.getRevision(dict)
        this.meta[dict]
            .get('revisions')
            .push({ revision: currRevision + 1, changes: { type: Type.DELETE, word } })
            .removeOldChanges()
            .write()

        this.data[dict]
            .get('words')
            .unset(word)
            .write()
    }
}

module.exports = Model
