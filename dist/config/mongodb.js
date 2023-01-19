"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class MongoConnect {
    connect() {
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connect(`${process.env.DB_URL}`, {
            readPreference: 'secondary',
            maxPoolSize: 50
        }).then(() => console.log('MongoDB connected!!', process.env.DB_URL))
            .catch((err) => console.log('Failed to connect to MongoDB', err));
        mongoose_1.default.syncIndexes().then().catch();
    }
}
exports.default = new MongoConnect();
