"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidatorWare {
    constructor(selectedObject) {
        this.PRODUCTS = {
            name: /[a-zA-Z0-9]{3,}/g,
            description: /[a-zA-Z0-9]{3,}/g,
            price: /[0-9]/,
            stock: /[0-9]/,
            code: /[0-9A-Z]/
        };
        this.validation = (req, res, next) => {
            let data;
            if (this.selectedOnject !== 'PRODUCTS') {
                data = req.body.products;
            }
            else
                data = req.body;
            const validationObject = this.PRODUCTS;
            if (req.body === null)
                next();
            const dataKeys = Object.keys(data);
            const validationKeys = Object.keys(validationObject);
            const result = [];
            dataKeys.forEach((item) => {
                if (validationKeys.includes(item)) {
                    const expression = new RegExp(validationObject[item]);
                    if (expression.test(data[item].toString())) {
                        result.push(true);
                    }
                    else
                        result.push(false);
                }
                else
                    result.push(true);
            });
            console.log(result);
            if (!result.includes(false))
                next();
            else {
                res.status(400).send({
                    data: [],
                    ok: false,
                    err: 'Data doesnt validate',
                    status: 400,
                    textStatus: 'Data doesnt validate'
                });
            }
        };
        this.selectedOnject = selectedObject;
    }
}
function authValidation(status) {
    const authVal = (req, res, next) => {
        if (status)
            next();
        else {
            res.status(401).send({
                data: [],
                ok: false,
                err: `${req.path} x método  no autorizada`,
                status: 401,
                textStatus: ''
            });
        }
    };
    return { authVal };
}
module.exports = { ValidatorWare, authValidation };
