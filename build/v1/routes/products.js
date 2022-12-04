"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
const configurations_1 = __importDefault(require("../../configurations/configurations"));
// const upload = require('../../configurations/configurations')
const express_1 = require("express");
// const Router = require('express').Router()
const products_controllers_1 = __importDefault(require("../../controllers/products.controllers"));
// const productControllers = require('../../controllers/products.controllers')
const ValidatorWare = require('../../services/validation');
const products = (0, express_1.Router)();
products.get('/', products_controllers_1.default.getItems);
products.get('/:id', products_controllers_1.default.getItems);
const validationWare = new ValidatorWare.ValidatorWare('PRODUCTS');
const authVerification = ValidatorWare.authValidation(true);
products.post('/', authVerification.authVal, configurations_1.default.single('image'), validationWare.validation, products_controllers_1.default.postItem);
products.put('/:id', authVerification.authVal, configurations_1.default.single('image'), validationWare.validation, products_controllers_1.default.updateItem);
products.delete('/:id', authVerification.authVal, products_controllers_1.default.deleteItem);
exports.default = products;
