const fs = require('fs')
const dict = {}
const text = fs.readFileSync('data/test2.dict', 'utf8')
let word = null
let translation = null
let newLine = true

for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n' || i === text.length - 1) {
        newLine = true
        if (translation && word) {

            const pureWord = word.split(' ')[0]
            dict[pureWord] = translation.slice(1)

            translation = null
        }
    } else {
        if (newLine) {
            if (text[i] === ' ') {
                translation = text[i]
            } else {
                word = text[i]
            }
        } else {
            if (translation) {
                translation += text[i]
            } else {
                word += text[i]
            }
        }
        newLine = false
    }
}

fs.writeFileSync('myjsonfile.json', JSON.stringify(dict), 'utf8');
