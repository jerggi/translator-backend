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
        const dict = {}
        if (!text) {
            return dict
        }

        let word = null
        let translation = null
        let newLine = true

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                newLine = true
                if (translation) {
                    dict[word] = translation.slice(1) // removing ' '
                    translation = null
                }
            } else {
                if (newLine) {
                    if (text[i] === ' ') {
                        translation = text[i] // adding ' '
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

        if (!dict[word] && translation) {
            dict[word] = translation
        }

        return dict
    }

    getAppInfo () {
        return info
    }
}

module.exports = new DataController()
