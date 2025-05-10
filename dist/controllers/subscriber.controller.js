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
exports.SubscriberController = void 0;
const subscriber_service_1 = require("../services/subscriber.service");
exports.SubscriberController = {
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required.' });
            }
            try {
                const subscriber = yield subscriber_service_1.SubscriberService.subscribe(email);
                res.status(201).json({
                    message: 'Successfully subscribed!',
                    subscriber,
                });
            }
            catch (error) {
                console.error('Error subscribing:', error.message);
                if (error.message === 'Email already subscribed') {
                    res.status(409).json({ error: error.message });
                }
                res.status(500).json({ error: 'Internal server error.' });
            }
        });
    }
};
