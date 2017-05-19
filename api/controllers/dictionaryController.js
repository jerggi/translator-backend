const codes = require('../utils/constants').HTTP_CODES
const Type = require('../../data/constants.js')

const Db = require('../../data/index')
const DataCtrl = require('./dataController')
const WordCtrl = require('./wordController')

class DictionaryController {
    createDictionary (name, text) {
        if (Db.data.hasDictionary(name)) {
            return { error: `Dictionary '${name}' already exists.`, code: codes.CONFLICT }
        }

        if (!this.isNameValid(name)) {
            return { error: 'Dictionary name cannot contain following characters: < > : " / \\ | ? *', code: codes.BAD_REQUEST }
        }

        const dict = text ? DataCtrl.toJSON(text) : { words: {}, wordCount: 0 }

        Db.data.createDictionary(name, dict.words, dict.wordCount)

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


        let changesToSend = Db.data.getChanges(dict, revision)
        let recievedChanges = changes
        console.log('RECIEVED CHANGES', recievedChanges)

        let mergedChanges

        if (Array.isArray(recievedChanges) && recievedChanges.length > 0) {
            mergedChanges = this.mergeChanges(recievedChanges, changesToSend)
            changesToSend = mergedChanges.sending
            recievedChanges = mergedChanges.recieved

            console.log('ADDING CHANGES', recievedChanges)
            
            if (recievedChanges.length > 0) {
                this.addChanges(dict, revision, recievedChanges)
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

        console.log('CHANGES TO SEND', changesToSend)
        return { changes: changesToSend, revision: newRevision }
    }

    addChanges (dict, revision, changes) {
        _.forEach(changes, c => {
            if (c.type === Type.ADD && c.word && c.translation) {
                WordCtrl.addWord(dict, c.word, c.translation)
            } else if (c.type === Type.DELETE && c.word) {
                WordCtrl.deleteWord(dict, c.word)
            }
        })
    }

    reduceChanges (changes) {
        const recentWordChange = {}
        const reducedChanges = []
        for (let i = changes.length - 1; i >= 0; i--) {
            const word = changes[i].word
            const type = changes[i].type

            if (recentWordChange[word]) {
                if (recentWordChange[word].type !== Type.DELETE) {
                    recentWordChange[word] = changes[i]
                    reducedChanges.unshift(changes[i])
                }

            } else {
                recentWordChange[word] = changes[i]
                reducedChanges.unshift(changes[i])
            }
        }

        return reducedChanges
    }

    mergeChanges(recievedChanges, sendingChanges) {
        let recievedMerged = []
        let sendingMerged = []
        const recievedWords = this.separateWords(recievedChanges)
        const sendingWords = this.separateWords(sendingChanges)

        _.forEach(recievedWords, (changes, recievedWord) => {
            const wordsSendingChanges = sendingWords[recievedWord]
            if (wordsSendingChanges) { // word w has some changes in recieved and also sending changes, has to resolve possible conflicts
                if (changes[0].type === Type.DELETE && changes.length === 1) { // deleting of word
                    
                    if (wordsSendingChanges[wordsSendingChanges.length - 1].type !== Type.ADD) {
                        recievedMerged = recievedMerged.concat(changes)
                    }

                    sendingMerged = sendingMerged.concat(wordsSendingChanges)

                } else if (changes[0].type === Type.DELETE && changes.length > 1) { // editing of word

                    if (wordsSendingChanges[0].type === Type.DELETE && wordsSendingChanges.length === 1) { // DELETE
                        sendingMerged = sendingMerged.concat(wordsSendingChanges)
                    } else if (wordsSendingChanges[0].type === Type.DELETE && wordsSendingChanges.length > 1) { // DELETE, ADD, ...
                        // removes delete from both
                        sendingMerged = sendingMerged.concat(wordsSendingChanges.slice(1, wordsSendingChanges.length))
                        recievedMerged = recievedMerged.concat(changes.slice(1, changes.length))
                    } else if (wordsSendingChanges[0].type === Type.ADD) { // ADD, ...
                            sendingMerged = sendingMerged.concat(wordsSendingChanges)
                            recievedMerged = recievedMerged.concat(changes.concat(wordsSendingChanges))
                    }

                } else if (changes[0].type === Type.ADD) { // adding of word

                    if (wordsSendingChanges[0].type === Type.DELETE && wordsSendingChanges.length === 1) { // DELETE
                        sendingMerged = sendingMerged.concat(wordsSendingChanges)
                    } else if (wordsSendingChanges[0].type === Type.DELETE && wordsSendingChanges.length > 1) { // DELETE, ADD, ...
                        // removes delete from both
                        sendingMerged = sendingMerged.concat(wordsSendingChanges.concat(changes))
                        recievedMerged = recievedMerged.concat(changes)
                    } else if (wordsSendingChanges[0].type === Type.ADD) { // ADD, ...
                            sendingMerged = sendingMerged.concat(wordsSendingChanges)
                            recievedMerged = recievedMerged.concat(changes)
                    }
                }

                delete sendingWords[recievedWord]
            } else {
                recievedMerged = recievedMerged.concat(changes)
            }            
        })

        _.forEach(sendingWords, (changes, sendingWord) => {
            sendingMerged = sendingMerged.concat(changes)
        })

        return {recieved: recievedMerged, sending: sendingMerged}

    }

    separateWords (changes) {
        const obj = {}

        changes.forEach((ch, index) => {        
            if (obj[ch.word]) {
                if (ch.type === Type.DELETE) {
                    obj[ch.word] = [ch] // removing changes before del, they are not relevant
                } else {
                    obj[ch.word].push(ch)
                }
            } else {
                obj[ch.word] = [ch]
            }
        })
        
        return obj
    }

    parseToString(words) {
        let str = ''

        _.forEach(words, (value, key) => {
            str += `${key}\n ${value}\n`
        })

        return str.length === 0 ? str : str.slice(0, -1)
    }

    isNameValid(name) {
        return /^[^<>:"/\|?*]*$/.test(name)
    }

    changeEquals (ch1, ch2) {
        if (ch1.type === ch2.type) {
            return ch1.word === ch2.word && (ch1.translation ? ch1.translation === ch2.translation : true)
        }

        return false
    }
}

module.exports = new DictionaryController()
