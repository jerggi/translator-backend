const fs = require('fs');

const storagePath = './data';

module.exports = {
    allDictionaries: () => {
        const dictionaries = fs.readdirSync(storagePath);

        return dictionaries;
    },
    getDictionary: (name) => {
        const dictionary = fs.readFileSync(`${storagePath}/${name}.json`);

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
        fs.readFile(`${storagePath}/test9.dict`, (err, data) => {
            if (err) throw err;
            console.log(data);
        });
    }
}
