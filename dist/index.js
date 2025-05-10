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
const client_1 = require("./prisma/client");
const express_1 = __importDefault(require("express"));
const contactus_routes_1 = __importDefault(require("./routes/contactus.routes"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const subscribe_1 = __importDefault(require("./routes/subscribe"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
const port = 3000;
app.use((0, cors_1.default)({
    origin: "*", // Allows all origins
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies and authorization headers
}));
app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});
app.use('/api/contactus', contactus_routes_1.default);
app.use('/api', subscribe_1.default);
app.use('/api/auth', auth_routes_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client_1.prisma.$connect(); // Connect to PostgreSQL
            console.log("Connected to PostgreSQL successfully!");
            // Start the server
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        catch (error) {
            console.error("Failed to connect to the database:", error);
            process.exit(1); // Exit if connection fails
        }
    });
}
startServer();
