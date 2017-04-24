const low = require('lowdb')
const fs = require('fs')
const path = require('path')

const Model = require('./Model')

const storagePath = path.join('data', 'dicts')
const metaPath = path.join('data', '_meta')

let dicts
let meta

function createMixins(db) {
    db._.mixin({
        findLatestRevs: function(revs, revision) {
            let index = revs.length - 1

            for (let i = revs.length - 1; i >= 0; i--) {
                if (revs[i].revision === revision) {
                    return revs.slice(i + 1)
                }
            }

            return null
        }
    })

    return db
}

class Db {
	load () {
		if (!dicts && !meta) {
            // loading dict files
            const files = fs.readdirSync(storagePath)
            dicts = {}

            files.forEach(file => {
                const fileName = file.split('.').slice(0, -1).join('.')
                const filePath = path.join(storagePath, fileName + '.json')

                dicts[fileName] = low(filePath)
            })
            console.log('dictionary files loaded')

            // loading meta files
            const metaFiles = fs.readdirSync(metaPath)
            meta = {}

            metaFiles.forEach(file => {
                const fileName = file.split('.').slice(0, -1).join('.')
                const filePath = path.join(metaPath, fileName + '.json')

                meta[fileName.slice(1)] = createMixins(low(filePath))
            })
            console.log('meta files loaded')

			this.data = new Model(dicts, meta)
		}
	}
}

module.exports = new Db()
