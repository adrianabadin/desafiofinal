"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const express_1 = __importDefault(require("express"));
const products_1 = require("./v1/routes/products");
const cart_1 = require("./v1/routes/cart");
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use('/api/products', products_1.products);
app.use('/api/cart', cart_1.cartRoutes);
app.use(express_1.default.json());
app.use(express_1.default.static('./src/public'));
app.get('/', (_req, res) => {
    res.send('Servidor Conectado');
});
app.listen(PORT, () => console.log(`Conectado en el puerto ${PORT}`));
