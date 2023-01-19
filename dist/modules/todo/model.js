"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    iUser: { type: mongoose_1.Types.ObjectId, required: true, ref: 'users' },
    sDesc: { type: String, required: true },
    bCompleted: { type: Boolean, default: false },
    dDate: { type: Date, required: true }
}, { timestamps: true });
TodoSchema.index({ iUser: -1 });
exports.default = (0, mongoose_1.model)('todos', TodoSchema);
