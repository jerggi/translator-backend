const fs = require('fs')
const linebyline = require('linebyline')
const storagePath = './data';

// in memory DB
const data = {}

class DataController {
    static loadData() {
        const dict = {}
        let word = null

        const filePromises = _.map(fs.readdirSync(storagePath), file => {
            return new Promise((resolve, reject) => {
                const readLiner = linebyline(`data/${file}`)

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

        return Promise.all(filePromises);
    }

    static getData() {
        return data;
    }

    get dictionaries() {
        return Object.keys(data);
    }
}

module.exports = DataController;
