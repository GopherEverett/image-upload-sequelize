const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001
const imageController = require('./controllers/imageController')





app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))



app.get('/', imageController.getAllImages)
app.post('/addImage', imageController.upload, imageController.addImage )

app.use('/Images', express.static('./Images'))

app.listen(PORT, () => console.log(`Server Started On Port: ${PORT}`))