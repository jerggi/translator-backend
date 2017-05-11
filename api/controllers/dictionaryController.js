const codes = require('../utils/constants').HTTP_CODES
const Type = require('../../data/constants.js')

const Db = require('../../data/index')
const DataCtrl = require('./dataController')

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

    findAll () {
        return Db.data.getDictList()
    }

    syncDictionary (dict, revision, changes) {
        if (!Db.data.hasDictionary(dict)) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (revision === 0) {
            console.log('CANNOT SYNCHRONIZE')
            return { error: `Different dictionary with name '${dict}' already exists. Cannot synchronize. To synchronize rename your dictionary.`, code: codes.CONFLICT }
        }

        console.log('RECIEVING CHANGES: ', changes)

        const changesToSend = Db.data.getChanges(dict, revision)

        console.log('SENDING CHANGES: ', changesToSend)

        if (Array.isArray(changes) && changes.length > 0) {
            const filteredChanges = this.filterConflicts(changes, changesToSend)
            
            if (filteredChanges.length > 0) {
                //console.log('APPLYING CHANGES: ', filteredChanges)
                Db.data.addChanges(dict, revision, filteredChanges)
            }
        }

        const newRevision = Db.data.getRevision(dict)
        
        if (changesToSend === null) { // revision too old, sending whole dictionary
            const dictToSend = Db.data.findDictionary(dict)
            return {
                revision: newRevision,
                text: this.parseToString(dictToSend.words)
            }
        }

        return { changes: changesToSend, revision: newRevision }
    }

    filterConflicts (recievedChanges, changesToSend) {
        return _.filter(recievedChanges, (recieved) => {
            const conflict = _.findLast(changesToSend, (toSend) => {
                return recieved.word === toSend.word
            })

            if (conflict) console.log('conflict: ', conflict)

            return conflict === undefined
        })
    }

    parseToString(words) {
        let str = ''

        _.forEach(words, (value, key) => {
            str += `${key}\n ${value}\n`
        })

        return str.length === 0 ? str : str.slice(0, -1)
    }
}

module.exports = new DictionaryController()
