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
            return json ? foundDict : this.parseToString(foundDict)
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

        //Db.data.syncDictionary(dict, revision, changes)

        return changesToSend
    }

    parseToString(dict) {
        let dictStr = ''

        _.forEach(dict.words, (value, key) => {
            dictStr += `${key}\n ${value}\n`
        })

        return {
            name: dict.name,
            text: dictStr
        }
    }
}

module.exports = new DictionaryController()
