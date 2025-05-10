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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.setUsernameAndPassword = exports.verifyOtp = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
// POST /auth/register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure the data from the request body
        const { fullName, email, contactNumber, schoolName, roleInSchool, studentSize } = req.body;
        // Check if all required fields are provided
        if (!fullName || !email || !contactNumber || !schoolName || !roleInSchool || !studentSize) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }
        // Convert studentSize to a number (in case it's a string)
        const parsedStudentSize = typeof studentSize === 'string' ? parseInt(studentSize, 10) : studentSize;
        // Ensure studentSize is a valid number
        if (isNaN(parsedStudentSize)) {
            res.status(400).json({ error: "Student size must be a valid number." });
        }
        // Create a new object with parsed studentSize
        const registrationData = Object.assign(Object.assign({}, req.body), { studentSize: parsedStudentSize });
        // Call the registerUser function
        const result = yield (0, auth_service_1.registerUser)(registrationData);
        // Return a success response
        res.status(201).json(result);
    }
    catch (err) {
        // Return an error response if registration fails
        console.error("Error during registration:", err);
        res.status(400).json({ error: err.message });
    }
});
exports.register = register;
// POST /auth/verify-otp
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.verifyUserOtp)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.verifyOtp = verifyOtp;
const setUsernameAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.setUser)(req.body);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.setUsernameAndPassword = setUsernameAndPassword;
// POST /auth/login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.loginUser)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.login = login;
