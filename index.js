const fs = require('fs')

// key - value storage ( in memory )
const data = {}
const fileStoragePath = './data.json'

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

readData()

data['somekey'] = 'great value'

console.log(data)
