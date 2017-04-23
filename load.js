db.connect().then(() => {
  console.log('connected to DB')
  //app.listen(3000, () => console.log('server listening on port 3000'));

  dataController.loadData().then(() => {
    const dicts = dataController.getData()

    Object.keys(dicts).forEach(dict => {
        db.Dict.createDict(dicts[dict])
            .then(() => console.log(`dictionary ${dict} created`))
            .catch((err) => console.error(err))
    })

  })

  //print(db)
}).catch((err) => {
	console.error('ERR:', err);
})
