const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express()


var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '115af9b4254348888e1816323224ac29',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world!')

app.use(express.json())

const plants = ['Peace lily', 'Aloe vera', 'English ivy']

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use(express.static(path.join(__dirname, '../public')))

app.get('/api/plants', (req, res) => {
    rollbar.info("Plants was requested", plants)
    res.status(200).send(plants)
})

app.post('/api/plants', (req, res) => {
   let {name} = req.body

   const index = plants.findIndex((plant) => {
       return plant === name
   });

   try {
       if (index === -1 && name !== '') {
           plants.push(name)

           rollbar.info("A new plant was created", name)
           res.status(200).send(plants)
       } else if (name === ''){
           rollbar.error("A plant was posted without a name")

           res.status(400).send('You must enter a name.')
       } else {
           rollbar.critical("A plant that already exists was posted", name)
           res.status(400).send('That plant already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/plants/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    plants.splice(targetIndex, 1)
    res.status(200).send(plants)
})


const port = process.env.PORT || 4005

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Listening on port ${port}`))