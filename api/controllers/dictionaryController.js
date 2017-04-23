const fs = require('fs')
const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

//const Db = require('../../data/Db')
const Db = require('../../data/index')

//TODO use 'path' module
const storagePath = './data/dictionaries'

class DictionaryController {
    createDictionary (name, data) {
        if (Db.data.hasDictionary(name)) {
            return { error: `Dictionary '${name}' already exists.`, code: codes.CONFLICT }
        }

        Db.data.createDictionary(name, data)

        return { code: codes.CREATED }
    }

    deleteDictionary (name) {
        if (!Db.data.hasDictionary(name)) {
            return { error: `Dictionary '${name}' not found.`, code: codes.BAD_REQUEST }
        }

        Db.data.deleteDictionary(name)

        return { code: codes.NO_CONTENT }
    }

    findDictionary (dict) {
        return Db.data.findDictionary(dict)
    }

    findAll () {
        return Db.data.getDictList()
    }
}

module.exports = new DictionaryController()
