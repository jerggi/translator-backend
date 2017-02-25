const fs = require('fs')

const storagePath = './data'

module.exports = {
    allDictionaries: () => {
        const dictionaries = _.map(fs.readdirSync(storagePath), file => {
            return file.substr(0, file.lastIndexOf('.'))
        })

        return dictionaries
    },
    getDictionary: (name) => {
        const dictionary = fs.readFileSync(`${storagePath}/${name}.dict`)

        return dictionary
    },
    createDictionary: (name, data) => {
        if (fs.existsSync(`${storagePath}/${name}.json`)) {
            console.log('yes')
        } else {
            console.log('no')
        }
    },
    read: (file) => {
        fs.readFile(`${storagePath}/${file}`, (err, data) => {
            if (err) throw err
            console.log(data)
        })
    }
}
