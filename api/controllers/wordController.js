const data = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

module.exports = {
    addWord: (dict, word, translations) => {
        const dicts = data()

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
    changeWord: (dict, word, newWord, newTranslation) => {
        const dicts = data()

        if (!data[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        return { code: codes.NO_CONTENT }
    },
    changeTranslations: (dict, word, newTranslation) => {
        const dicts = data()

        if (!data[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        return { code: codes.NO_CONTENT }
    },
    deleteWord: (dict, word) => {
        const dicts = data()

        if (!dicts[dict]) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        delete dicts[dict][word]

        console.log(dicts[dict])

        return { code: codes.NO_CONTENT }
    }
}
