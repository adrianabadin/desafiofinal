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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDbManager = exports.CartClass = exports.ItemClass = void 0;
const fs_1 = __importDefault(require("fs"));
const TIMEOUT = 3000;
class ItemClass {
    constructor(id, name, description, code, image, price, stock) {
        this.id = id;
        this.timeStamp = Date.now();
        this.name = name;
        this.description = description;
        this.code = code;
        this.image = image;
        this.price = price;
        this.stock = stock;
    }
}
exports.ItemClass = ItemClass;
class CartClass {
    constructor(id, timeStamp, cartProducts) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.products = cartProducts;
    }
}
exports.CartClass = CartClass;
class VersionClass {
    constructor(timeStamp, blocked, blockStart) {
        this.timeStamp = timeStamp;
        this.blocked = blocked;
        this.blockStart = blockStart;
    }
}
class JsonDbManager {
    constructor(file) {
        this.file = file;
        this.data = [];
        this.version = new VersionClass(0, false, 0);
    }
    loadVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let version;
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (fs_1.default.existsSync(`${this.file}.version`)) {
                version = yield JSON.parse(yield fs_1.default.promises.readFile(`${this.file}.version`, 'utf-8'));
                console.log(version);
            }
            else {
                version = new VersionClass(Date.now(), false, 0);
                yield fs_1.default.promises.writeFile(`${this.file}.version`, JSON.stringify(version), 'utf-8');
            }
            return version;
        });
    }
    versionCompare() {
        return __awaiter(this, void 0, void 0, function* () {
            const objectVersion = this.version;
            const dbVersion = yield this.loadVersion();
            if (dbVersion.timeStamp !== objectVersion.timeStamp) {
                return false;
            }
            else
                return true;
        });
    }
    updateVersion(block) {
        return __awaiter(this, void 0, void 0, function* () {
            if (block)
                this.version = new VersionClass(Date.now(), true, Date.now());
            else
                this.version = new VersionClass(Date.now(), false, 0);
            void fs_1.default.promises.writeFile(`${this.file}.version`, JSON.stringify(this.version), 'utf-8');
        });
    }
    readData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.versionCompare())) {
                // eslint-disable-next-line no-extra-boolean-cast
                if (Boolean(fs_1.default.existsSync(`${this.file}.JSONE`))) {
                    this.data = yield JSON.parse(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `[${yield fs_1.default.promises.readFile(`${this.file}.JSONE`, 'utf-8')}]`);
                }
                else {
                    const jsonMod = JSON.stringify(this.data).slice(1, this.data.length - 1);
                    void fs_1.default.promises.writeFile(`${this.file}.JSONE`, jsonMod, 'utf-8');
                    void this.updateVersion(false);
                }
            }
            return this.data;
        });
    }
    saveFile() {
        return __awaiter(this, void 0, void 0, function* () {
            while ((yield this.loadVersion()).blocked) {
                console.log('DataStorage blocked');
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield this.updateVersion(false); }), TIMEOUT);
            }
            yield this.updateVersion(true);
            const jsonEdited = JSON.stringify(this.data).slice(1, -1);
            yield fs_1.default.promises.writeFile(`${this.file}.JSONE`, jsonEdited, 'utf-8');
            yield this.updateVersion(false);
        });
    }
    largestId() {
        let id;
        if (Boolean(fs_1.default.existsSync(`${this.file}.JSONE`)) && this.data.length > 0) {
            id = Math.max(...this.data.map((item) => item.id)) + 1;
        }
        else
            id = 0;
        return id;
    }
    appendItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield this.updateVersion(false); }), TIMEOUT);
            while ((yield this.loadVersion()).blocked) {
                console.log('DataStorage blocked');
            }
            yield this.updateVersion(true);
            try {
                void fs_1.default.promises.appendFile(`${this.file}.JSONE`, item);
            }
            catch (err) {
                console.log(err);
            }
            yield this.updateVersion(false);
        });
    }
    addItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readData();
            let response;
            const itemUpdated = Object.assign(Object.assign({}, item), { id: this.largestId() });
            this.data.push(itemUpdated);
            try {
                if (this.data.length > 1) {
                    yield this.appendItem(',' + JSON.stringify(itemUpdated));
                }
                else
                    yield this.appendItem(JSON.stringify(itemUpdated));
                response = {
                    data: [itemUpdated],
                    ok: true,
                    err: '',
                    status: 200,
                    textStatus: 'Element updated'
                };
            }
            catch (e) {
                response = {
                    data: [],
                    ok: false,
                    err: 'Unable to write in the DB',
                    status: 400,
                    textStatus: ''
                };
            }
            return response;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readData();
            const response = yield this.data.filter((item) => item.id === id);
            return response.length === 0
                ? {
                    data: [],
                    textStatus: '',
                    err: 'The id does not exist',
                    status: 403,
                    ok: false
                }
                : {
                    data: response,
                    textStatus: 'Element found',
                    err: ' ',
                    status: 200,
                    ok: true
                };
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readData();
            return this.data.length > 0
                ? {
                    data: this.data,
                    ok: true,
                    err: '',
                    status: 200,
                    textStatus: 'Get All elements Fullfiled'
                }
                : {
                    data: [],
                    ok: true,
                    textStatus: 'No data contained',
                    status: 403,
                    err: ''
                };
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readData();
            const item = this.data.find((dataItem) => dataItem.id === id);
            if (item != null) {
                this.data = this.data.filter((item) => item.id !== id);
                yield this.saveFile();
                return {
                    data: [item],
                    ok: true,
                    err: '',
                    status: 200,
                    textStatus: 'Element Deleted'
                };
            }
            else {
                return {
                    data: [],
                    ok: false,
                    err: 'The id does not exist',
                    status: 400,
                    textStatus: 'The id does not exist'
                };
            }
        });
    }
    updateById(item, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readData();
            const dataIndex = this.data.findIndex((dataItem) => dataItem.id === id);
            if (dataIndex !== -1) {
                this.data[dataIndex] = item;
                yield this.saveFile();
                return {
                    data: [item],
                    ok: true,
                    err: '',
                    status: 200,
                    textStatus: 'Successyfull update'
                };
            }
            else {
                return {
                    data: [],
                    ok: false,
                    err: 'The Id doesnt exist',
                    status: 400,
                    textStatus: 'The Id doesnt exist'
                };
            }
        });
    }
}
exports.JsonDbManager = JsonDbManager;
module.exports = { JsonDbManager, ItemClass, CartClass };
