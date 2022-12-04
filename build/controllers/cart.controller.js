"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartControllers = void 0;
const dbService_1 = require("../services/dbService");
// import { dataStream, Item } from '../types'
// const ItemClass = require('../services/dbService').ItemClass
const Product = require('../services/dbService').JsonDbManager;
const cartDbManager = new Product('./databases/cart');
function CartControllers() {
    const createCart = (_req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield cartDbManager.addItem({ id: 0, timeStamp: Date.now(), products: [] });
            res.status(201).send('Resource succesifuly created');
        }
        catch (err) {
            res.status(400).send('Didnt Create Resource (Cart)');
        }
    });
    const addProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const id = parseInt(req.params.id);
            const transitionObject = yield cartDbManager.getById(id);
            const cleanObject = transitionObject.data;
            cleanObject[0].products.push(new dbService_1.ItemClass(data.id, data.name, data.description, data.code, data.image, data.price, data.stock));
            const response = yield cartDbManager.updateById(cleanObject[0], parseInt(req.params.id));
            res.status(response.status).send(response.data);
        }
        catch (e) {
            res.status(400).send({ err: 'Unable to add item to the cart ' });
        }
    });
    const getCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        const data = yield cartDbManager.getById(id);
        res.status(data.status).send(data.data);
    });
    const deleteCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        console.log(id);
        const data = yield cartDbManager.deleteById(id);
        console.log(data);
        res.status(data.status).send(data.data);
    });
    const deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, id_prod } = req.params;
        const { data } = yield cartDbManager.getById(parseInt(id));
        const index = data[0].products.findIndex((product) => { return product.id === parseInt(id_prod); });
        data[0].products.splice(index, 1);
        const response = yield cartDbManager.updateById(data[0], parseInt(id));
        res.status(response.status).send(response.data);
    });
    return { createCart, addProduct, getCart, deleteCart, deleteProduct };
}
exports.CartControllers = CartControllers;
module.exports = CartControllers;
