"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express = require('express')
const express_1 = __importDefault(require("express"));
// const express = require('express')
const products_1 = __importDefault(require("./v1/routes/products"));
const cart_1 = __importDefault(require("./v1/routes/cart"));
// const productos = require('./v1/routes/products')
// const carts = require('./v1/routes/cart')
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use('/api/products', products_1.default);
app.use('/api/cart', cart_1.default);
app.use((req, res) => {
    res.status(404).send(`The route ${req.path} in the method ${req.method} is not yet implemented`);
});
app.use(express_1.default.json());
app.use(express_1.default.static('./src/public'));
app.get('/', (_req, res) => {
    res.send('Servidor Conectado');
});
app.listen(PORT, () => console.log(`Conectado en el puerto ${PORT}`));
