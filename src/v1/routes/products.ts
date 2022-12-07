/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import upload from '../../configurations/configurations'
// const upload = require('../../configurations/configurations')
import { Router } from 'express'
// const Router = require('express').Router()
import productController from '../../controllers/products.controllers'
// const productControllers = require('../../controllers/products.controllers')

const ValidatorWare = require('../../services/validation')
const products = Router()
products.get('/', productController.getItems)
products.get('/:id', productController.getItems)
const validationWare = new ValidatorWare.ValidatorWare('PRODUCTS')
const authVerification = ValidatorWare.authValidation(false)
products.post(
  '/',
  authVerification.authVal,
  upload.single('image'),
  validationWare.validation,
  productController.postItem
)
products.put(
  '/:id',
  authVerification.authVal,
  upload.single('image'),
  validationWare.validation,
  productController.updateItem
)
products.delete('/:id', authVerification.authVal, productController.deleteItem)

export default products
