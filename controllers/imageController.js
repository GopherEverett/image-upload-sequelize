const db = require('../models')
const multer = require('multer')
const path = require('path')
const { Image } = require('../models')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '5000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|JPG|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper file format to upload')
    }
}).single('image')

const addImage = async (req, res) => {
    let info = {
        image: req.file.path,
        title: req.body.title
    }
    const image = await Image.create(info)
    res.status(200).send(image)
    console.log(image)
}

const getAllImages = async  (req, res) => {
    const images = await Image.findAll()
    res.status(200).send(images)
}

module.exports = {
    storage,
    upload,
    addImage,
    getAllImages
}