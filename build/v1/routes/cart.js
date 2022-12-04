"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const express = require('express');
const CartControllers = require('../../controllers/cart.controller');
const cartController = CartControllers();
exports.cartRoutes = (0, express_1.Router)();
exports.cartRoutes.get('/:id', cartController.getCart);
exports.cartRoutes.use(express.json());
exports.cartRoutes.post('/', cartController.createCart);
exports.cartRoutes.post('/:id/products', cartController.addProduct);
exports.cartRoutes.delete('/:id', cartController.deleteCart);
exports.cartRoutes.delete('/:id/products/:id_prod', cartController.deleteProduct);
exports.default = exports.cartRoutes;
