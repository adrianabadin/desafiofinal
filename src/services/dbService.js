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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var VersionClass = /** @class */ (function () {
    function VersionClass(timeStamp, blocked, blockStart) {
        this.timeStamp = timeStamp;
        this.blocked = blocked;
        this.blockStart = blockStart;
    }
    return VersionClass;
}());
var JsonDbManager = /** @class */ (function () {
    function JsonDbManager(file) {
        this.file = file;
        this.data = [];
        this.version = new VersionClass(0, false, 0);
    }
    JsonDbManager.prototype.loadVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!fs.existsSync("".concat(this.file, ".version"))) return [3 /*break*/, 3];
                        _a = this;
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, fs.promises.readFile("".concat(this.file, ".version"), "utf-8")];
                    case 1: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                    case 2:
                        _a.version = _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.version = new VersionClass(Date.now(), false, 0);
                        return [4 /*yield*/, fs.promises.writeFile("".concat(this.file, ".version"), JSON.stringify(this.version), "utf-8")];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [2 /*return*/, this.version];
                }
            });
        });
    };
    JsonDbManager.prototype.versionCompare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbVersion, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dbVersion = this.version;
                        console.log("Ingresando a version compare");
                        if (!(this.version.timeStamp === 0)) return [3 /*break*/, 1];
                        this.loadVersion();
                        return [2 /*return*/, true];
                    case 1:
                        _a = dbVersion;
                        return [4 /*yield*/, this.loadVersion()];
                    case 2:
                        if (_a !== (_b.sent())) {
                            return [2 /*return*/, false];
                        }
                        else
                            return [2 /*return*/, true];
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JsonDbManager.prototype.updateVersion = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (block)
                    this.version = new VersionClass(Date.now(), true, Date.now());
                else
                    this.version = new VersionClass(Date.now(), false, 0);
                fs.promises.writeFile("".concat(this.file, ".version"), JSON.stringify(this.version), "utf-8");
                return [2 /*return*/];
            });
        });
    };
    JsonDbManager.prototype.readData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, jsonMod;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.versionCompare];
                    case 1:
                        if (!!(_e.sent())) return [3 /*break*/, 5];
                        console.log("Version compare false");
                        if (!fs.existsSync("".concat(this.file, ".JSON"))) return [3 /*break*/, 4];
                        _a = this;
                        _c = (_b = JSON).parse;
                        _d = "[".concat;
                        return [4 /*yield*/, fs.promises.readFile("".concat(this.file, ".JSON"), "utf-8")];
                    case 2: return [4 /*yield*/, _c.apply(_b, [_d.apply("[", [_e.sent(), "]"])])];
                    case 3:
                        _a.data = _e.sent();
                        console.log(this.data);
                        return [3 /*break*/, 5];
                    case 4:
                        jsonMod = JSON.stringify(this.data).slice(1, this.data.length - 1);
                        fs.promises.writeFile("".concat(this.file, ".JSON"), jsonMod, "utf-8");
                        this.updateVersion(false);
                        _e.label = 5;
                    case 5:
                        console.log(this.data);
                        return [2 /*return*/, this.data];
                }
            });
        });
    };
    return JsonDbManager;
}());
var dataMan = new JsonDbManager("data1");
console.log(dataMan.readData(), "ALgo");
exports["default"] = JsonDbManager;