"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriber_controller_1 = require("../controllers/subscriber.controller");
const router = (0, express_1.Router)();
// POST /api/subscribe
router.post('/subscribe', subscriber_controller_1.SubscriberController.subscribe);
exports.default = router;
