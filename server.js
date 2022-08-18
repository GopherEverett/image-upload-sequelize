const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()
const Multer = require('multer')
const PORT = process.env.PORT || 3001
const { Image } = require('./models')
require('dotenv').config()
const imageController = require('./controllers/imageController')
const FirebaseStorage = require('multer-firebase-storage')

const multer = Multer({
    storage: FirebaseStorage({
        bucketName: 'multer-firebase.appspot.com',
        credentials: {
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_KEY?.replace(/\\n/g, '\n'),
            projectId: 'multer-firebase'
        },
        public: true,
        hooks: {
            beforeUpload(req, file) {
                file.originalname = Date.now() + file.originalname
                console.log(`before upload:`, file)
            },
        }
    })
})




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))



app.get('/', imageController.getAllImages)
// app.post('/add-image', imageController.upload, imageController.addImage)

app.post('/add-image', multer.single('image'), async (req, res) => {
    let info = {
        image: req.file.publicUrl,
        title: req.body.title
    }
    let data = await Image.create(info)
    res.status(201).json(data)
})

app.use('/Images', express.static('./Images'))

app.listen(PORT, () => console.log(`Server Started On Port: ${PORT}`))