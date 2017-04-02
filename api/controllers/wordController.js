const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

module.exports = {
    addWord: (dict, word, translations) => {
        const dicts = dataController.getData()

        if (dicts[dict] === undefined) {
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
    changeWord: (dict, word, newWord, translation, newTranslation) => {
        const dicts = dataController.getData()

        if (dicts[dict] === undefined) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (dicts[dict][word] === undefined) {
            return { code: codes.NO_CONTENT }
        }

        let translations = dicts[dict][word]

        if (translation && newTranslation) {
            const index = _.indexOf(translations, translation)

            if (index !== -1) {
                translations[index] = newTranslation
            }
        } else if (newTranslation) {
            translations =  [newTranslation]
        }

        if (newWord) {
            delete dicts[dict][word]
            dicts[dict][newWord] = translations
        } else {
            dicts[dict][word] = translations
        }


        return { code: codes.NO_CONTENT }
    },
    deleteWord: (dict, word, translation) => {
        const dicts = dataController.getData()

        if (dicts[dict] === undefined) {
            return { error: `Dictionary '${dict}' not found.`, code: codes.BAD_REQUEST }
        }

        if (translation) {
            let translations = dicts[dict][word]

            if (translations) {
                translations = translations.filter((t) => {
                    t !== translation
                })
            }

            dicts[dict][word] = translations
        } else {
            delete dicts[dict][word]
        }

        return { code: codes.NO_CONTENT }
    }
}
