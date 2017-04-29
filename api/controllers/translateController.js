const dataController = require('./dataController')
const Db = require('../../data/index')

const levenshteinDist = require('../utils/levenshtein')
const parse = require('../utils/wordParser')
const C = require('../utils/constants')

class TranslateController {
    findTranslations (word, dictList) {
        let dictToSearch = dictList
        if (dictToSearch && !Array.isArray(dictToSearch)) {
            dictToSearch = [dictToSearch]
        }

        const dicts = Db.data.findDictionaries(dictToSearch)
        const words = parse(word)
        let translations = []

        // for each word from request
        _.forEach(words, (word) => {
            // search in each dictionary from request
            _.forEach(dicts, (dict) => {
                // for each word in dictionary
                _.forEach(dict.words, (translation, key) => {
                    let distance = levenshteinDist(word, key)

                    if (distance < C.LEVENSHTEIN_LIMIT) {
                        translations.push({ word, key, translation, distance, dict: dict.name })
                    }
                })
            })
        })

        return translations
    }
}

module.exports = new TranslateController()
