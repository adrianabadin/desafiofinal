/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Request, Response } from 'express'
import { ItemClass } from '../services/dbService'
import { dataStream, Item } from '../types'
// import { dataStream, Item } from '../types'
// const ItemClass = require('../services/dbService').ItemClass
const Product = require('../services/dbService').JsonDbManager
const cartDbManager = new Product('./databases/cart')

export function CartControllers (): any {
  const createCart = async (_req: Request, res: Response): Promise<any> => {
    try {
      await cartDbManager.addItem({ id: 0, timeStamp: Date.now(), products: [] })
      res.status(201).send('Resource succesifuly created')
    } catch (err) { res.status(400).send('Didnt Create Resource (Cart)') }
  }

  const addProduct = async (req: Request, res: Response): Promise <any> => {
    console.log('addproduct', req.body)
    try {
      const data: Item = req.body
      const id = parseInt(req.params.id)
      const transitionObject: dataStream = await cartDbManager.getById(id)
      const cleanObject: any = transitionObject.data
      console.log(transitionObject, id, 'DATA:', data)
      cleanObject[0].products.push(new ItemClass(data.id, data.name, data.description, data.code, data.image, data.price, data.stock))
      console.log(cleanObject[0])
      const response = await cartDbManager.updateById(cleanObject[0], parseInt(req.params.id))
      res.status(response.status).send(response.data)
    } catch (e) { res.status(400).send({ err: 'Unable to add item to the cart ' }) }
  }
  const getCart = async (req: Request, res: Response): Promise<any> => {
    const id = parseInt(req.params.id)
    const data = await cartDbManager.getById(id)
    res.status(data.status).send(data.data)
  }
  const deleteCart = async (req: Request, res: Response): Promise <any> => {
    const id = parseInt(req.params.id)
    console.log(id)
    const data = await cartDbManager.deleteById(id)
    console.log(data)
    res.status(data.status).send(data.data)
  }
  const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    const { id, id_prod } = req.params
    const { data } = await cartDbManager.getById(parseInt(id))
    const index = data[0].products.findIndex((product: any) => { return product.id === parseInt(id_prod) })
    data[0].products.splice(index, 1)
    const response = await cartDbManager.updateById(data[0], parseInt(id))
    res.status(response.status).send(response.data)
  }
  return { createCart, addProduct, getCart, deleteCart, deleteProduct }
}

module.exports = CartControllers
