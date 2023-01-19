"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = __importDefault(require("./controllers"));
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const router = (0, express_1.Router)();
router.post('/:id', authCheck_1.default, [
    (0, express_validator_1.body)('sContent').not().isEmpty()
], controllers_1.default.add);
router.put('/:id', authCheck_1.default, [
    (0, express_validator_1.body)('sContent').not().isEmpty()
], controllers_1.default.edit);
router.delete('/:id', authCheck_1.default, controllers_1.default.delete);
// public apis
router.get('/post/list/:id', controllers_1.default.listPublicPostComments);
exports.default = router;
