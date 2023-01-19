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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("../modules/user/model"));
const responseMessages_1 = __importDefault(require("../utils/responseMessages"));
const statusCode_1 = __importDefault(require("../utils/statusCode"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if (!token) {
            return res.status(statusCode_1.default.Unauthorized).json({
                message: responseMessages_1.default.authFailed
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        const userData = yield model_1.default.findOne({ _id: decoded.id }, { _id: 1 });
        if (!userData) {
            return res.status(statusCode_1.default.Unauthorized).json({
                message: responseMessages_1.default.authFailed
            });
        }
        req.userId = userData._id.toString();
        next();
    }
    catch (err) {
        return res.status(statusCode_1.default.Unauthorized).json({
            message: responseMessages_1.default.authFailed
        });
    }
});
