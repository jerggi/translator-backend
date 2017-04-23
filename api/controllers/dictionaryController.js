const fs = require('fs')
const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

//const Db = require('../../data/Db')
const Db = require('../../data/index')

//TODO use 'path' module
const storagePath = './data/dictionaries'

class DictionaryController {
    createDictionary () {
        const result = Db.data.createDictionary(name, data)
    }

    findDictionary (dict) {
        return Db.data.findDictionary(dict)
    }

    findAll () {
        return Db.data.findAll('neviemus')
    }
}

module.exports = new DictionaryController()
