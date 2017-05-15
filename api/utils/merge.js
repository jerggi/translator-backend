const mergeTranslations = (tr1, tr2) => {
    const merged = `${tr1}${tr1[tr1.length - 1] === '\n' ? '' : '\n'}${tr2}`

    return merged

    /*const newTr = tr1.split(';').concat(tr2.split(';')).map(_.trim)
    const hashMap = {}
    
    // remove duplicates
    return newTr.filter(t => {
        if (t.length === 0 || hashMap[t]) {
            return false;
        } else {
            hashMap[t] = true
            return true
        }
    }).join('; ')*/
}

module.exports = mergeTranslations;
