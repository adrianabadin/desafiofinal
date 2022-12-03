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
exports.productControllers = void 0;
const ItemClass = require('../services/dbService').ItemClass;
const Product = require('../services/dbService').JsonDbManager;
const productDbManager = new Product('./src/databases/product');
function productControllers() {
    const postItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const item = req.body;
        const uploadedImage = `./images/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename.toString()}`;
        const data = yield productDbManager.addItem(new ItemClass(0, item.name, item.description, item.code, uploadedImage, item.price, item.stock));
        res.status(responseAnalizer(data).status).send(responseAnalizer(data).data);
    });
    const getItems = (req, res) => __awaiter(this, void 0, void 0, function* () {
        let data;
        console.log(req.params.id, 'params');
        if (req.params.id !== undefined) {
            data = yield productDbManager.getById(parseInt(req.params.id));
        }
        else {
            data = yield productDbManager.getAll();
        }
        res.status(responseAnalizer(data).status).send(responseAnalizer(data).data);
    });
    const updateItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _b;
        const uploadedImage = `./images/${(_b = req.file) === null || _b === void 0 ? void 0 : _b.filename}`;
        const data = yield productDbManager.updateById(new ItemClass(parseInt(req.params.id), req.body.name, req.body.description, req.body.code, uploadedImage, req.body.price, req.body.stock), parseInt(req.params.id));
        res.status(responseAnalizer(data).status).send(responseAnalizer(data).data);
    });
    const deleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield productDbManager.deleteById(parseInt(req.params.id));
        res.status(responseAnalizer(data).status).send(responseAnalizer(data).data);
    });
    function responseAnalizer(data) {
        if (data.ok) {
            return { status: data.status, data: data.data };
        }
        else
            return { status: data.status, data: data.err };
    }
    return { postItem, updateItem, deleteItem, getItems };
}
exports.productControllers = productControllers;
module.exports = productControllers;
