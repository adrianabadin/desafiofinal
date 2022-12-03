import { Item, ValidationObject, SelectionObject } from '../types'
import { Response, NextFunction, Request } from 'express'
export class ValidatorWare {
  private readonly selectedOnject: SelectionObject
  private readonly PRODUCTS: ValidationObject = {
    name: /[a-zA-Z0-9]{3,}/g,
    description: /[a-zA-Z0-9]{3,}/g,
    price: /[0-9]/,
    stock: /[0-9]/,
    code: /[0-9A-Z]/
  }

  constructor (selectedObject: SelectionObject) {
    this.selectedOnject = selectedObject
  }

  validation = (req: Request, res: Response, next: NextFunction): any => {
    let data: Item
    if (this.selectedOnject !== 'PRODUCTS') {
      data = req.body.products as unknown as Item
    } else data = req.body as unknown as Item
    const validationObject: ValidationObject = this.PRODUCTS
    if (req.body === null) next()
    const dataKeys: string[] = Object.keys(data)
    const validationKeys: string[] = Object.keys(validationObject)
    const result: boolean[] = []
    dataKeys.forEach((item) => {
      if (validationKeys.includes(item)) {
        const expression = new RegExp(
          validationObject[item as keyof ValidationObject]
        )
        if (expression.test(data[item as keyof Item].toString())) {
          result.push(true)
        } else result.push(false)
      } else result.push(true)
    })
    console.log(result)
    if (!result.includes(false)) next()
    else {
      res.status(400).send({
        data: [],
        ok: false,
        err: 'Data doesnt validate',
        status: 400,
        textStatus: 'Data doesnt validate'
      })
    }
  }
}

function authValidation (status: boolean): any {
  const authVal = (req: Request, res: Response, next: NextFunction): any => {
    if (status) next()
    else {
      res.status(401).send({
        data: [],
        ok: false,
        err: `${req.path} x método ${req.method} no autorizada`,
        status: 401,
        textStatus: ''
      })
    }
  }
  return { authVal }
}
module.exports = { ValidatorWare, authValidation }
