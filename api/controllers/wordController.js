const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

module.exports = {
    addWord: (dict, word, translations) => {
        const dicts = dataController.getData()

        if (!dicts[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
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
    changeWord: (dict, word, newWord, newTranslations) => {
        const dicts = data()

        if (!data[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        delete dicts[dict][word]
        dicts[dict][newWord] = newTranslations

        return { code: codes.NO_CONTENT }
    },
    changeTranslations: (dict, word, newTranslations) => {
        const dicts = data()

        if (!dicts[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (!dicts[dict][word]) {
            return { error: `Word '${word}' not found in dictionary '${dict}'`, code: codes.BAD_REQUEST }
        }

        return { code: codes.NO_CONTENT }
    },
    deleteWord: (dict, word) => {
        const dicts = data()

        if (!dicts[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        delete dicts[dict][word]

        return { code: codes.NO_CONTENT }
    }
}
