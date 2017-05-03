function createMixins(db) {
    db._.mixin({
        findLatestChanges: function(revs, revision) {
            for (let i = revs.length - 1; i >= 0; i--) {
                if (revs[i].revision === revision) {
                    return _.map(revs.slice(i + 1), rev => rev.changes)
                }
            }

            return null
        }
    })

    return db
}

module.exports = createMixins
