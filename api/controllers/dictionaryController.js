const fs = require('fs')
const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

//const Db = require('../../data/Db')
const Db = require('../../data/index')
const DataCtrl = require('./dataController')

//TODO use 'path' module
const storagePath = './data/dictionaries'

class DictionaryController {
    createDictionary (name, text) {
        if (Db.data.hasDictionary(name)) {
            return { error: `Dictionary '${name}' already exists.`, code: codes.CONFLICT }
        }

        const dict = text ? DataCtrl.toJSON(text) : {}

        Db.data.createDictionary(name, dict)

        return { code: codes.CREATED, body: { revision: 1 } }
    }

    deleteDictionary (name) {
        if (!Db.data.hasDictionary(name)) {
            return { error: `Dictionary '${name}' not found.`, code: codes.BAD_REQUEST }
        }

        Db.data.deleteDictionary(name)

        return { code: codes.NO_CONTENT }
    }

    findDictionary (dict, json = false) {
        const foundDict = Db.data.findDictionary(dict)

        if (foundDict) {
            return json ? foundDict : {
                name: foundDict.name,
                revision: Db.data.getRevision(foundDict.name),
                text: this.parseToString(foundDict.words)
            }
        } else {
             return { error: `Dictionary '${name}' not found.`, code: codes.BAD_REQUEST }
        }
    }

    findAll (full) {
        if (full) {
            return Db.data.getDictListFull()
        } else {
            return Db.data.getDictList()
        }
    }

    syncDictionary (dict, revision, changes) {
        if (!Db.data.hasDictionary(dict)) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        const changesToSend = Db.data.getChanges(dict, revision)

        if (Array.isArray(changes) && changes.length > 0) {
            Db.data.addChanges(dict, revision, changes)
        }

        // TEMP - array as string JSON
        if (!Array.isArray(changes)) {
            Db.data.addChanges(dict, revision, JSON.parse(changes))
        }

        const newRevision = Db.data.getRevision(dict)

        return { changes: changesToSend, revision: newRevision }
    }

    parseToString(words) {
        let str = ''

        _.forEach(words, (value, key) => {
            str += `${key}\n ${value}\n`
        })

        return str.length === 0 ? str : str.slice(0, -1)
        // return str
    }
}

module.exports = new DictionaryController()
