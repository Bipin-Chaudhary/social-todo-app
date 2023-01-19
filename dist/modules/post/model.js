"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    iUser: { type: mongoose_1.Types.ObjectId, required: true, ref: 'users' },
    sTitle: { type: String, required: true },
    sContent: { type: String, required: true }
}, { timestamps: true });
PostSchema.index({ iUser: -1 });
exports.default = (0, mongoose_1.model)('posts', PostSchema);
