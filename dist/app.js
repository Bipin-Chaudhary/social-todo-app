"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const responseMessages_1 = __importDefault(require("./utils/responseMessages"));
const statusCode_1 = __importDefault(require("./utils/statusCode"));
// routes
const routes_1 = __importDefault(require("./modules/user/routes"));
const routes_2 = __importDefault(require("./modules/todo/routes"));
const routes_3 = __importDefault(require("./modules/post/routes"));
const routes_4 = __importDefault(require("./modules/comment/routes"));
const recachegoose_1 = __importDefault(require("recachegoose"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
dotenv_1.default.config();
const app = (0, express_1.default)();
// mongodb connect
mongodb_1.default.connect();
// redis
const redisClient = (0, redis_1.createClient)({ url: 'redis://default:fzRhniTcn4Lcmi4AaaVfSgKgcmHZogoY@redis-10060.c245.us-east-1-3.ec2.cloud.redislabs.com:10060' });
redisClient.connect();
redisClient.on('connect', () => console.log('redis connected'));
(0, recachegoose_1.default)(mongoose_1.default, {
    engine: 'redis',
    client: redisClient
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', (req, res, next) => {
    res.send('welcome to social todo app');
});
// APIs
app.use('/api/user', routes_1.default);
app.use('/api/todo', routes_2.default);
app.use('/api/post', routes_3.default);
app.use('/api/comment', routes_4.default);
// default route
app.all('*', (req, res, next) => {
    return res.status(statusCode_1.default.Forbidden).json({
        status: statusCode_1.default.Forbidden,
        message: responseMessages_1.default.invalidPath
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`); });
