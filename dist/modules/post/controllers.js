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
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = __importDefault(require("./model"));
const statusCode_1 = __importDefault(require("../../utils/statusCode"));
const responseMessages_1 = __importDefault(require("../../utils/responseMessages"));
const express_validator_1 = require("express-validator");
const defaultPagination_1 = __importDefault(require("../../utils/defaultPagination"));
const recachegoose_1 = __importDefault(require("recachegoose"));
class PostController {
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return res.status(statusCode_1.default.UnprocessableEntity).json({ status: statusCode_1.default.UnprocessableEntity, errors: errors.array() });
                const { sContent, sTitle } = req.body;
                const createObj = { iUser: req.userId, sContent, sTitle };
                const post = yield model_1.default.create(createObj);
                recachegoose_1.default.clearCache('list-post', null);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.addedSuccessfully.replace('##', 'post'), data: post });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return res.status(statusCode_1.default.UnprocessableEntity).json({ status: statusCode_1.default.UnprocessableEntity, errors: errors.array() });
                const { id } = req.params;
                const { sContent, sTitle } = req.body;
                const updateObj = { iUser: req.userId, sContent, sTitle };
                const post = yield model_1.default.findOne({ _id: id, iUser: new mongoose_1.default.Types.ObjectId(req.userId) });
                if (!post)
                    return res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'post') });
                const updatedPost = yield model_1.default.findByIdAndUpdate(id, updateObj, { new: true });
                recachegoose_1.default.clearCache(id, null);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.editedSuccessfully.replace('##', 'post'), data: updatedPost });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const post = yield model_1.default.findOne({ _id: id, iUser: new mongoose_1.default.Types.ObjectId(req.userId) });
                if (!post)
                    return res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'post') });
                yield model_1.default.deleteOne({ _id: id });
                recachegoose_1.default.clearCache('list-post', null);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.deletedSuccessfully.replace('##', 'post'), data: null });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    details(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // @ts-ignore
                const post = yield model_1.default.findOne({ _id: id, iUser: new mongoose_1.default.Types.ObjectId(req.userId) }).cache(30, id);
                if (!post)
                    return res.status(statusCode_1.default.NotFound).json({ message: responseMessages_1.default.notFound.replace('##', 'post') });
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'post'), data: post });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip } = (0, defaultPagination_1.default)(req.query);
                const query = { iUser: new mongoose_1.default.Types.ObjectId(req.userId) };
                // @ts-ignore
                const post = yield model_1.default.find(query).cache(30, 'list-post')
                    .skip(skip)
                    .limit(limit)
                    .lean();
                const total = yield model_1.default.countDocuments(query);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'post'), data: { docs: post, total } });
            }
            catch (error) {
                return res.status(statusCode_1.default.InternalServerError).json({
                    status: statusCode_1.default.InternalServerError,
                    message: responseMessages_1.default.InternalServerError
                });
            }
        });
    }
    listPublicPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip } = (0, defaultPagination_1.default)(req.query);
                const { id } = req.params; // user id
                const query = { iUser: new mongoose_1.default.Types.ObjectId(id) };
                // @ts-ignore
                const posts = yield model_1.default.find(query).cache(30, 'list-post')
                    .skip(skip)
                    .limit(limit)
                    .lean();
                const total = yield model_1.default.countDocuments(query);
                return res.status(statusCode_1.default.OK).json({ message: responseMessages_1.default.fetchedSuccessfully.replace('##', 'post'), data: { docs: posts, total } });
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
exports.default = new PostController();
