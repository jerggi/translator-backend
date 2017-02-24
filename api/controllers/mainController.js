const data = require('./dataController')
const levenshteinDist = require('../utils/levenshtein')
const parse = require('../utils/wordParser')
const C = require('../utils/constants')

process.on('exit', (code) => {
  console.log('Process going to exit, writing in memory data to file');
  //writeData()
});

module.exports = {
    findTranslation: (word, dictList) => {
        let dicts = data()
        let dictsForSearch
        let translations = []
        const words = parse(word)

        if (_.isEmpty(dictList)) {
            dictsForSearch = Object.keys(dicts)
        } else {
            dictsForSearch = dictList.split(',')
        }

        // for each word from request
        _.forEach(words, (word) => {
            // search in each dictionary from request
            _.forEach(dictsForSearch, (dict) => {
                if (dicts[dict]) {
                    // search word in dictionary
                    _.forEach(dicts[dict], (values, key) => {
                        let distance = levenshteinDist(word, key)

                        if (distance < C.LEVENSHTEIN_LIMIT) {
                            translations.push({ word, key, values, distance, dict })
                        }
                    })
                }
            })
        })

        return translations;
    }
}
