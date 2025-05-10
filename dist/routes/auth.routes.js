"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/verify-otp', auth_controller_1.verifyOtp);
router.post('/username', auth_controller_1.setUsernameAndPassword);
router.post('/login', auth_controller_1.login);
router.get('/admin-only', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['ADMIN']), (req, res) => {
    var _a;
    res.json({ message: `Hello Admin ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}` });
});
router.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    var _a;
    res.json({ message: `Welcome, user ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}` });
});
exports.default = router;
