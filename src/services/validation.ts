import { Item, ValidationObject, SelectionObject } from "../types";
import { Response, NextFunction, Request, RequestHandler } from "express";
export class MiddleWares {
  private selectedOnject: SelectionObject;
  private products: ValidationObject = {
    name: /[a-zA-Z0-9]{3,}/g,
    description: /[a-zA-Z0-9]{3,}/g,
    price: /[0-9]/,
    stock: /[0-9]/,
    code: /[0-9A-Z]/,
  };

  constructor(selectedObject: SelectionObject) {
    this.selectedOnject = selectedObject;
  }

  validation = (req: Request, _res: Response, next: NextFunction): void => {
    let validationObject: ValidationObject;
    if (this.selectedOnject === "products") {
      validationObject = this.products;
    }
    console.log(req);
    if (req.body === null) next();
    const data: Item = req.body as unknown as Item;
    const dataKeys: Array<string> = Object.keys(data);
    const validationKeys: Array<string> = Object.keys(validationObject);
    let result: Array<boolean> = [];
    dataKeys.forEach((item) => {
      if (validationKeys.includes(item)) {
        const expression = new RegExp(
          validationObject[item as keyof ValidationObject]
        );
        if (expression.test(data[item as keyof Item].toString())) {
          result.push(true);
        } else result.push(false);
      } else result.push(true);
    });
    console.log(result);
    if (result.includes(false)) return;
    // return {
    //   data: [],
    //   ok: false,
    //   err: "Data provided doesnt pass validation",
    //   status: 400,
    //   textStatus: "Data Provided Doesnt pass validation",
    // };
    else {
      next();
      // return true;
    }
  };
}

module.exports = MiddleWares;
