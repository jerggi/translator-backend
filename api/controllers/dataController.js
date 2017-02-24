const linebyline = require('linebyline')

const data = {}
const fileStoragePath = './data/data.json';
const storagePath = './data';

let word = null

const lineReader1 = linebyline('data/test1.dict')
const dict1 = {}

const lineReader2 = linebyline('data/test2.dict')
const dict2 = {}

lineReader1.on('line', function (line) {
    if (word === null) {
        word = line.split(' ')[0]
    } else {
        if (line[0] === ' ') {
            const translations = line.split(';')

            for (let i = 0; i < translations.length; i++) {
                translations[i] = translations[i].substr(1, translations[i].length - 1)
            }

            dict1[word] = translations;
            word = null;
        } else {
            word = line.split(' ')[0]
        }
    }
}).on('close', () => {
    console.log('dictionary test1 loaded')
    data['test1'] = dict1
}).on('error', function(e) {
    console.error(e)
});

lineReader2.on('line', function (line) {
    if (word === null) {
        word = line.split(' ')[0]
    } else {
        if (line[0] === ' ') {
            const translations = line.split(';')

            for (let i = 0; i < translations.length; i++) {
                translations[i] = translations[i].substr(1, translations[i].length - 1)
            }

            dict2[word] = translations
            word = null
        } else {
            word = line.split(' ')[0]
        }
    }
}).on('close', () => {
    console.log('dictionary test2 loaded')
    data['test2'] = dict2
}).on('error', function(e) {
    console.error(e)
});

module.exports = () => data;
