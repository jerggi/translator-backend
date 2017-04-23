const low = require('lowdb')
const db = low('dict1.json')
global._ = require('lodash')
const dataCtrl = require('./api/controllers/dataController')

dataCtrl.loadData().then(() => {
    const dicts = dataCtrl.getData()

    Object.keys(dicts).forEach(dict => {
        db.set(dict, dicts[dict]).write()
    })
})
