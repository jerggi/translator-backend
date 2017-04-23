const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

const mergeTranslations = require('../utils/merge')
const Db = require('../../data/index')

class WordController {
    addWord (dict, word, translation) {
        const foundDict = Db.data.findDictionary(dict)

        if (foundDict === undefined) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        let trToSet = translation
        
        if (foundDict.words[word]) {
            trToSet = mergeTranslations(foundDict.words[word], translation)
        }
        
        Db.data.addWord(dict, word, trToSet)

        return { code: codes.CREATED }
    }

    changeWord (dict, word, newWord, newTranslation) {
        const foundDict = Db.data.findDictionary(dict)

        if (foundDict === undefined) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        const wordToSet = newWord ? newWord : word
        let trToSet = newTranslation

        if (wordToSet !== word && foundDict.words[wordToSet]) {
            trToSet = mergeTranslations(foundDict.words[wordToSet], newTranslation)
        }

        Db.data.changeWord(dict, word, wordToSet, trToSet)

        return { code: codes.NO_CONTENT }
    }

    deleteWord (dict, word) {
        const foundDict = Db.data.findDictionary(dict)

        if (foundDict === undefined) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        Db.data.deleteWord(dict, word)

        return { code: codes.NO_CONTENT }
    }
}

module.exports = new WordController()
