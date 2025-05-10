"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactUs_controller_1 = require("../controllers/contactUs.controller");
const router = (0, express_1.Router)();
router.post('/', contactUs_controller_1.ContactUs);
exports.default = router;
