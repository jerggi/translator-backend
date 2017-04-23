const fs = require('fs')
const linebyline = require('linebyline')
const storagePath = 'data/dictionaries/'

// in memory DB
const data = {}
const info = require('../../data/app/info.json')

//TODO
const parentheses = ['\'','/','(',')','<','>','[',']','{','}']

function containParentheses(word) {
    for(let i = 0; i < word.length; i++) {
        if (parentheses.includes(word[i])) return true
    }
    
    return false
}

function containPunct(word) {
    for(let i = 0; i < word.length; i++) {
        if (isPunct(word[i])) return true
    }
    
    return false
}

function removePuncts(word) {
    let newWord = ''
    for(let i = 0; i < word.length; i++) {
        if (!isPunct(word[i])) newWord += word[i]
    }
    return newWord
}

function isPunct(ch)
{
    switch (ch)
    {
        case '!':
        case '"':
        case '#':
        case '$':
        case '%':
        case '&':
        case '\'':
        case '(':
        case ')':
        case '*':
        case '+':
        case ',':
        case '-':
        case '.':
        case '/':
        case ':':
        case ';':
        case '<':
        case '=':
        case '>':
        case '?':
        case '@':
        case '[':
        case '\\':
        case ']':
        case '^':
        case '_':
        case '`':
        case '{':
        case '|':
        case '}':
        case '~': return true;
        default: return false;
    }
}

class DataController {
    static loadData() {
        const filePromises = _.map(fs.readdirSync(storagePath), file => {
            return new Promise((resolve, reject) => {
                const readLiner = linebyline(`data/dictionaries/${file}`)
                const dict = {}
                let word = null

                readLiner.on('line', (line) => {
                    if (word === null) {
                        let words = line.split(' ') 
                        words = words.filter(w => !containParentheses(w))
                        words = words.map(w => removePuncts(w))

                        // some words have more than 1 word
                        word = words.join(' ')

                    } else {
                        if (line[0] === ' ') { // adding translation to word
                            /*const translations = line.split(';')

                            for (let i = 0; i < translations.length; i++) {
                                translations[i] = translations[i].substr(1, translations[i].length - 1)
                            }*/

                            dict[word] = line.substr(1)
                            word = null
                        } else { // creting key word
                            //if word in parentheses - not part of key
                            //else remove all punct, except - and merge remaining into key word
                            /*const words = line.split(' ')
                            word = line.split(' ')[0]*/

                            let words = line.split(' ') 
                            words = words.filter(w => !containParentheses(w))
                            words = words.map(w => removePuncts(w))

                            // some words have more than 1 word
                            word = words.join(' ')
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
