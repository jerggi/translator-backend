const fs = require('fs')
const linebyline = require('linebyline')
const storagePath = 'data/dictionaries/'

// in memory DB
const data = {}
const info = require('../../data/app/info.json')

class DataController {
    static loadData() {
        const filePromises = _.map(fs.readdirSync(storagePath), file => {
            return new Promise((resolve, reject) => {
                const readLiner = linebyline(`data/dictionaries/${file}`)
                const dict = {}
                let word = null

                readLiner.on('line', (line) => {
                    if (word === null) {
                        word = line.split(' ')[0]
                    } else {
                        if (line[0] === ' ') {
                            const translations = line.split(';')

                            for (let i = 0; i < translations.length; i++) {
                                translations[i] = translations[i].substr(1, translations[i].length - 1)
                            }

                            dict[word] = translations
                            word = null
                        } else {
                            word = line.split(' ')[0]
                        }
                    }
                }).on('close', () => {
                    const key = file.substr(0, file.lastIndexOf('.'))
                    data[key] = dict
                    console.log(`dictionary ${file} loaded`)
                    resolve(dict)
                }).on('error', (err) => {
                    reject(err)
                })
            })
        })

        return Promise.all(filePromises)
    }

    static writeData(file, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(`./data/dictionaries/dict_write.dict`, data, (err) => {
                if (err) {
                    reject(err)
                }

                resolve('the file was sved')
            })
        })
    }

    static getData() {
        return data
    }

    static getAppInfo() {
        return info;
    }

    static getDictionaries() {
        return _.map(Object.keys(data), (dict) => {
            return {
                name: dict,
            }
        })
    }

    static getDictList() {
        return Object.keys(data)
    }
}

module.exports = DataController
