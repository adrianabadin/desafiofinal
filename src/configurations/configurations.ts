// MULTER CONFIGURATION
import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './public/images')
  },
  filename: function (_req, file, cb) {
    cb(null, '' + Date.now().toString() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

export default upload
