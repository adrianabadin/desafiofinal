/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Request, Response } from 'express'
import { dataStream, Item } from '../types'
const ItemClass = require('../services/dbService').ItemClass
const Product = require('../services/dbService').JsonDbManager
const productDbManager = new Product('./src/databases/product')

export function productControllers (): any {
  const postItem = async (req: Request, res: Response): Promise<any> => {
    const item: Item = req.body
    const uploadedImage: string = `./images/${req.file?.filename.toString()}`
    const data: dataStream = await productDbManager.addItem(
      new ItemClass(
        0,
        item.name,
        item.description,
        item.code,
        uploadedImage,
        item.price,
        item.stock
      )
    )
    res.status(responseAnalizer(data).status).send(responseAnalizer(data).data)
  }
  const getItems = async (req: Request, res: Response): Promise<any> => {
    let data: dataStream
    console.log(req.params.id, 'params')
    if (req.params.id !== undefined) {
      data = await productDbManager.getById(parseInt(req.params.id))
    } else {
      data = await productDbManager.getAll()
    }

    res.status(responseAnalizer(data).status).send(responseAnalizer(data).data)
  }
  const updateItem = async (req: Request, res: Response): Promise<any> => {
    const uploadedImage = `./images/${req.file?.filename}`
    const data: dataStream = await productDbManager.updateById(
      new ItemClass(
        parseInt(req.params.id),
        req.body.name,
        req.body.description,
        req.body.code,
        uploadedImage,
        req.body.price,
        req.body.stock
      ), parseInt(req.params.id)
    )
    res.status(responseAnalizer(data).status).send(responseAnalizer(data).data)
  }
  const deleteItem = async (req: Request, res: Response): Promise<any> => {
    const data: dataStream = await productDbManager.deleteById(
      parseInt(req.params.id)
    )
    res.status(responseAnalizer(data).status).send(responseAnalizer(data).data)
  }
  function responseAnalizer (data: dataStream): any {
    if (data.ok) {
      return { status: data.status, data: data.data }
    } else return { status: data.status, data: data.err }
  }
  return { postItem, updateItem, deleteItem, getItems }
}

module.exports = productControllers
