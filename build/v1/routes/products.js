"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const configurations_1 = require("../../configurations/configurations");
const productControllers = require('../../controllers/products.controllers');
const ValidatorWare = require('../../services/validation');
const productController = productControllers();
exports.products = (0, express_1.Router)();
exports.products.get('/', productController.getItems);
exports.products.get('/:id', productController.getItems);
const validationWare = new ValidatorWare.ValidatorWare('PRODUCTS');
const authVerification = ValidatorWare.authValidation(false);
exports.products.post('/', authVerification.authVal, configurations_1.upload.single('image'), validationWare.validation, productController.postItem);
exports.products.put('/:id', authVerification.authVal, configurations_1.upload.single('image'), validationWare.validation, productController.updateItem);
exports.products.delete('/:id', authVerification.authVal, productController.deleteItem);
