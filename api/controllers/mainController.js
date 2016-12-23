const fs = require('fs');
// key - value storage ( in memory )
const data = {}
const fileStoragePath = './data/data.json';
const storagePath = './data';

const writeData = () => {
  fs.writeFileSync(fileStoragePath, JSON.stringify(data))
}

const readData = () => {
  Object.assign(data, JSON.parse(fs.readFileSync(fileStoragePath)))
}

process.on('exit', (code) => {
  console.log('Process going to exit, writing in memory data to file');
  //writeData()
});

readData();

module.exports = {
    findTranslation: (word) => {
        const translation = data[word];

        return translation;
    },
    allDictionaries: () => {
        const dictionaries = fs.readdirSync(storagePath);

        return dictionaries;
    }

}
