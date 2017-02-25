const data = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

module.exports = {
    addWord: (dict, word, translations) => {
        const dicts = data()

        if (!dicts[dict]) {
            return { error: `Dictionary ${dict} not found.`, code: codes.BAD_REQUEST }
        }

        if (dicts[dict][word]) {
            let newTranslations = _.filter(translations, (newTr) => {
                return -1 === _.findIndex(dicts[dict][word], tr => tr === newTr)
            })

            dicts[dict][word] = _.concat(dicts[dict][word], newTranslations)
        } else {
            dicts[dict][word] = translations
        }

        return { code: codes.CREATED }
    },
    changeWord: (dict, word, newWord, newTranslation) => {
        if (!data[dict]) {
            return { error: `Dictionary ${dict} not found.` }
        }

    },
    changeTranslations: (dict, word, newTranslation) => {
        if (!data[dict]) {
            return { error: `Dictionary ${dict} not found.` }
        }

    },
    deleteWord: (dict, word) => {
        if (!data[dict]) {
            return { error: `Dictionary ${dict} not found.` }
        }

    }
}
