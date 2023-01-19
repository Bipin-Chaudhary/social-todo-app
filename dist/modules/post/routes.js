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
router.post('/', authCheck_1.default, [
    (0, express_validator_1.body)('sContent').not().isEmpty(),
    (0, express_validator_1.body)('sTitle').not().isEmpty()
], controllers_1.default.add);
router.put('/:id', authCheck_1.default, [
    (0, express_validator_1.body)('sContent').not().isEmpty(),
    (0, express_validator_1.body)('sTitle').not().isEmpty()
], controllers_1.default.edit);
router.delete('/:id', authCheck_1.default, controllers_1.default.delete);
router.get('/:id', authCheck_1.default, controllers_1.default.details);
router.get('/user/list', authCheck_1.default, controllers_1.default.list);
// public apis
router.get('/user/list/public/:id', controllers_1.default.listPublicPosts);
exports.default = router;
