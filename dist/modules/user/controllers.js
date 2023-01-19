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
const model_1 = __importDefault(require("./model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const statusCode_1 = __importDefault(require("../../utils/statusCode"));
const responseMessages_1 = __importDefault(require("../../utils/responseMessages"));
const express_validator_1 = require("express-validator");
const defaultPagination_1 = __importDefault(require("../../utils/defaultPagination"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const recachegoose_1 = __importDefault(require("recachegoose"));
class UsersController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return res.status(statusCode_1.default.UnprocessableEntity).json({ status: statusCode_1.default.UnprocessableEntity, errors: errors.array() });
                const { sName, sEmail, sMobile } = req.body;
                let { sPassword } = req.body;
                sPassword = yield bcryptjs_1.default.hash(sPassword, 10);
                const userExist = yield model_1.default.findOne({ sEmail }).lean();
                if (userExist)
                    return res.status(statusCode_1.default.Conflict).json({ message: responseMessages_1.default.accountExist });
                const user = yield model_1.default.create({ sName, sEmail, sMobile, sPassword });
                recachegoose_1.default.clearCache('list-public-users', null);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.userRegistered, data: user });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return res.status(statusCode_1.default.UnprocessableEntity).json({ status: statusCode_1.default.UnprocessableEntity, errors: errors.array() });
                const { sEmail, sPassword } = req.body;
                const userExist = yield model_1.default.findOne({ sEmail }).lean();
                if (!userExist) {
                    return res.status(401).json({
                        message: responseMessages_1.default.accountNotExist
                    });
                }
                const passwordResult = yield bcryptjs_1.default.compare(sPassword, userExist.sPassword);
                if (!passwordResult) {
                    return res.status(401).json({
                        message: responseMessages_1.default.invalidCredentials
                    });
                }
                const token = jsonwebtoken_1.default.sign({
                    sEmail: userExist.sEmail,
                    id: userExist._id
                }, `${process.env.JWT_KEY}`, {
                    expiresIn: '7d'
                });
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.loginSuccess, token });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    editProfileDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return res.status(statusCode_1.default.UnprocessableEntity).json({ status: statusCode_1.default.UnprocessableEntity, errors: errors.array() });
                const { sName, sMobile } = req.body;
                const userExist = yield model_1.default.findOne({ _id: req.userId }).lean();
                if (!userExist)
                    res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'account') });
                const user = yield model_1.default.findByIdAndUpdate({ _id: req.userId }, { sName, sMobile }, { new: true });
                recachegoose_1.default.clearCache(req.userId, null);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.editedSuccessfully.replace('##', 'profile'), data: user });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    getProfileDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const user = yield model_1.default.findOne({ _id: req.userId }, { sName: 1, sMobile: 1, sEmail: 1 }).cache(30, req.userId);
                if (!user)
                    res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'account') });
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'profile'), data: user });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    getPublicProfileDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // user id
                // @ts-ignore
                const user = yield model_1.default.findOne({ _id: id }, { sName: 1, sEmail: 1, sPhone: 1 }).cache(30, id);
                if (!user)
                    res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'account') });
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'profile'), data: user });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    listPublicUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip, search } = (0, defaultPagination_1.default)(req.query);
                const query = {};
                if (search)
                    query.$or = [{ sName: search }, { sEmail: search }];
                // @ts-ignore
                const users = yield model_1.default.find(query, { sName: 1, sEmail: 1, sMobile: 1 }).cache(30, 'list-public-users')
                    .skip(skip)
                    .limit(limit)
                    .lean();
                const total = yield model_1.default.countDocuments(query);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'users'), data: { docs: users, total } });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
}
exports.default = new UsersController();
