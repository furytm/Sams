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
exports.loginUser = exports.setUser = exports.verifyUserOtp = exports.registerUser = void 0;
const client_1 = require("../prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_util_1 = require("../utils/otp.util");
const sendOtp_util_1 = require("../utils/sendOtp.util");
const OTP_EXPIRY_MINUTES = 10;
/** 1. Register: create a user with OTP */
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield client_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already in use');
    // Generate OTP
    const otp = (0, otp_util_1.generateOTP)();
    const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
    yield client_1.prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            contactNumber: data.contactNumber,
            schoolName: data.schoolName,
            roleInSchool: data.roleInSchool,
            studentSize: data.studentSize,
            otp,
            otpExpires: expires,
            isVerified: false,
        },
    });
    yield (0, sendOtp_util_1.sendOTPEmail)(data.email, otp);
    return { message: 'OTP sent to email' };
});
exports.registerUser = registerUser;
/** 2. Verify OTP: mark user as verified */
const verifyUserOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, otp }) {
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!user ||
        user.otp !== otp ||
        !user.otpExpires ||
        user.otpExpires < new Date()) {
        throw new Error('Invalid or expired OTP');
    }
    yield client_1.prisma.user.update({
        where: { email },
        data: { isVerified: true, otp: null, otpExpires: null },
    });
    return { message: 'Account verified' };
});
exports.verifyUserOtp = verifyUserOtp;
/** 3. Set Username & Password: update user with username and password */
const setUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, username, password, role, }) {
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified) {
        throw new Error('User not found or not verified');
    }
    const existingUsername = yield client_1.prisma.user.findUnique({
        where: { username },
    });
    if (existingUsername) {
        throw new Error('Username already taken');
    }
    const hashed = yield argon2_1.default.hash(password);
    yield client_1.prisma.user.update({
        where: { email },
        data: { username, password: hashed,
            role: role !== null && role !== void 0 ? role : "TEACHER",
        },
    });
    return { message: 'Username and password set successfully' };
});
exports.setUser = setUser;
/** 4. Login: authenticate and return JWT */
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Invalid credentials');
    if (!user.isVerified)
        throw new Error('Account not verified');
    if (!user.password) {
        throw new Error('Password not set for this user');
    }
    const valid = yield argon2_1.default.verify(user.password, password);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token };
});
exports.loginUser = loginUser;
