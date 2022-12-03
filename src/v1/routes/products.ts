/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import multer from 'multer'
import { Router } from 'express'
import { dataStream } from '../../types'
const productControllers = require('../../controllers/products.controllers')
const ValidatorWare = require('../../services/validation')
const Product = require('../../services/dbService.ts').JsonDbManager
const productDbManager = new Product('./src/databases/product')
const productController = productControllers()
export const products = Router()
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/images')
  },
  filename: function (_req, file, cb) {
    cb(null, '' + Date.now().toString() + '-' + file.originalname)
  }
})
const upload = multer({ storage })
products.get(
  '/',
  async (_req, res) => {
    const data: dataStream = await productDbManager.getAll()
    if (data.ok) res.send(data.data)
    else res.send(`Error: ${data.err} Status: ${data.status}`)
  }
)
products.get('/:id', async (req, res) => {
  const data: dataStream = await productDbManager.getById(
    parseInt(req.params.id)
  )
  if (data.ok) res.send(data.data)
  else res.send(`Error: ${data.err} Status: ${data.status}`)
})

const validationWare = new ValidatorWare.ValidatorWare('PRODUCTS')
const authVerification = ValidatorWare.authValidation(true)
products.post('/', authVerification.authVal, upload.single('image'), validationWare.validation, productController.postItem)
products.put('/:id', authVerification.authVal, upload.single('image'), validationWare.validation, productController.updateItem)
products.delete('/:id', authVerification.authVal, productController.deleteItem)
