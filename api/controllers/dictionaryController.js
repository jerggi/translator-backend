const fs = require('fs')
const dataController = require('./dataController')
const codes = require('../utils/constants').HTTP_CODES

//TODO use 'path' module
const storagePath = './data/dictionaries'

module.exports = {
    allDictionaries: (full) => {
        if (full) {
            return dataController.getDictionaries()
        } else {
            return dataController.getDictList()
        }
    },
    getDictionary: (name) => {
        const dictionary = fs.readFileSync(`${storagePath}/${name}.dict`)

        return dictionary
    },
    getDictionaryJSON: (name) => {
        const dicts = dataController.getData()

        if (dicts[name] !== undefined) {
            return dicts[name]
        } else {
            return { error: `Dictionary '${name}' not found.`, code: codes.BAD_REQUEST }
        }
    },
    createDictionary: (name, data) => {
        const dictPath = `${storagePath}/${name}.dict`

        return new Promise((resolve, reject) => {
            if (fs.existsSync(dictPath)) {
                reject({ error: `Dictionary '${name}' allready exists.`, code: codes.CONFLICT })
            }

            fs.writeFile(dictPath, data, (err) => {
                if (err) {
                    reject(err)
                }

                resolve('OK')
            })
        })
    },
    read: (file) => {
        fs.readFile(`${storagePath}/${file}`, (err, data) => {
            if (err) throw err
            console.log(data)
        })
    }
}
