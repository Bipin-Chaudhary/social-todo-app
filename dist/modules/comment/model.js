"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    iUser: { type: mongoose_1.Types.ObjectId, required: true, ref: 'users' },
    iPost: { type: mongoose_1.Types.ObjectId, required: true, ref: 'posts' },
    sContent: { type: String, required: true }
}, { timestamps: true });
CommentSchema.index({ iUser: -1 });
CommentSchema.index({ iPost: -1 });
exports.default = (0, mongoose_1.model)('comments', CommentSchema);
