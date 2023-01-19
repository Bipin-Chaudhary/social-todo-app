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
router.post('/signup', [
    (0, express_validator_1.body)('sName').not().isEmpty(),
    (0, express_validator_1.body)('sEmail').isEmail(),
    (0, express_validator_1.body)('sMobile').not().isEmpty(),
    (0, express_validator_1.body)('sPassword').not().isEmpty()
], controllers_1.default.signup);
router.post('/login', [
    (0, express_validator_1.body)('sEmail').isEmail().not().isEmpty(),
    (0, express_validator_1.body)('sPassword').not().isEmpty()
], controllers_1.default.login);
router.put('/edit-profile', authCheck_1.default, [
    (0, express_validator_1.body)('sName').not().isEmpty(),
    (0, express_validator_1.body)('sMobile').not().isEmpty()
], controllers_1.default.editProfileDetails);
router.get('/profile', authCheck_1.default, controllers_1.default.getProfileDetails);
// public Apis
router.get('/public/profile/:id', controllers_1.default.getPublicProfileDetails);
router.get('/list-public-users', controllers_1.default.listPublicUsers);
exports.default = router;
