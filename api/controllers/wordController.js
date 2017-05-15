const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

const mergeTranslations = require('../utils/merge')
const Db = require('../../data/index')

class WordController {
    addWord (dict, word, translation) {
        const foundDict = Db.data.findDictionary(dict)

        if (!foundDict) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (!this.isWordValid(word)) {
            return { error: 'Word cannot contain following characters: . [ ]', code: codes.BAD_REQUEST }
        }

        const trToSet = translation
        let mergedTranslation = null
        
        if (foundDict.words[word]) {
            mergedTranslation = mergeTranslations(foundDict.words[word], translation)
        }
        
        Db.data.addWord(dict, word, trToSet, mergedTranslation)
        Db.data.setParams(dict, { wordCount: Db.data.getWordCount(dict) + mergedTranslation ? 0 : 1 })

        return { code: codes.CREATED }
    }

    changeWord (dict, word, newWord, newTranslation) {
        const foundDict = Db.data.findDictionary(dict)

        if (!foundDict) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (!this.isWordValid(word) || !this.isWordValid(newWord)) {
            return { error: 'Word cannot contain following characters: . [ ]', code: codes.BAD_REQUEST }
        }

        if (!foundDict.words[word]) {
            return { error: `Word '${word}' not found in dictionary.`, code: codes.BAD_REQUEST }
        }

        const wordToSet = newWord ? newWord : null
        const trToSet = newTranslation
        let mergedTranslation = null
        let wordCountChange = 0

        if (wordToSet && wordToSet !== word && foundDict.words[wordToSet]) {
            mergedTranslation = mergeTranslations(foundDict.words[wordToSet], newTranslation)
        }

        Db.data.changeWord(dict, word, wordToSet, trToSet, mergedTranslation)
        Db.data.setParams(dict, { wordCount: Db.data.getWordCount(dict) + mergedTranslation ? -1 : 0 }) // solve

        return { code: codes.NO_CONTENT }
    }

    deleteWord (dict, word) {
        const foundDict = Db.data.findDictionary(dict)

        if (!foundDict) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        // think about it - should at least save this change to metadata ?
        if (!foundDict.words[word]) {
            return { error: `Word '${word}' not found in dictionary.`, code: codes.BAD_REQUEST }
        }

        if (this.isWordValid(word)) {
            Db.data.deleteWord(dict, word)
            Db.data.setParams(dict, { wordCount: Db.data.getWordCount(dict) - 1 })
        }

        return { code: codes.NO_CONTENT }
    }

    isWordValid (word) {
        return /^[^.\[\]]*$/.test(word)
    }
}

module.exports = new WordController()
