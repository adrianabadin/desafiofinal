/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
const express = require('express')
const CartControllers = require('../../controllers/cart.controller')
const cartController = CartControllers()
export const cartRoutes = Router()
cartRoutes.get('/:id', cartController.getCart)
cartRoutes.use(express.json())
cartRoutes.post(
  '/', cartController.createCart
)
cartRoutes.post(
  '/:id/products', cartController.addProduct
)
cartRoutes.delete('/:id', cartController.deleteCart)
cartRoutes.delete('/:id/products/:id_prod', cartController.deleteProduct)
