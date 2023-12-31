const multer = require('multer')
const {v4:uuidv4} = require('uuid')
const path=require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueFilename = uuidv4()//this will generate a unique filename for the image
      cb(null, uniqueFilename + path.extname(file.originalname))//this will set the filename of the image as the unique filename generated by the uuid module and the extension of the image will be the extension of the original image
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports= upload