"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MULTER CONFIGURATION
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './public/images');
    },
    filename: function (_req, file, cb) {
        cb(null, '' + Date.now().toString() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
