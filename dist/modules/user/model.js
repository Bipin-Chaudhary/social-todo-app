"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsersSchema = new mongoose_1.Schema({
    sName: { type: String, required: true },
    sEmail: { type: String, required: true },
    sPassword: { type: String, required: true },
    sMobile: { type: String, required: true }
}, { timestamps: true });
UsersSchema.index({ sEmail: -1 }, { unique: true });
exports.default = (0, mongoose_1.model)('users', UsersSchema);
