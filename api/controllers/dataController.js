
// in memory
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

function isPunct(ch) {
    switch (ch) {
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
    // TODO check special characters !
    toJSON (text) {
        const words = {}
        let wordCount = 0
    
        if (!text) {
            return { words, wordCount }
        }

        let word = null
        let translation = null
        let newLine = true

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                newLine = true
                if (translation) {
                    if (this.isWordValid(word)) {
                        words[word] = translation.slice(1) // with removing ' '
                        wordCount++
                    }

                    translation = null
                }
            } else {
                if (newLine) {
                    if (text[i] === ' ') { // creating translation
                        translation = text[i] // ' ' added to translation
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

        if (!words[word] && translation) {
            words[word] = translation.slice(1) // with removing ' '
            wordCount++
        }

        return { words, wordCount }
    }

    isWordValid (word) {
        return /^[^.\[\]]*$/.test(word)
    }

    getAppInfo () {
        return info
    }
}

module.exports = new DataController()
