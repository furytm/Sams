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
exports.ContactUs = void 0;
const contactUs_1 = require("../services/contactUs");
const ContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { fullname, workemail, phonenumber, catergory, message, findus } = req.body;
        if (!fullname ||
            !workemail ||
            !phonenumber ||
            !catergory ||
            !message ||
            !findus) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const contact = yield contactUs_1.ContactusService.createContactUs(fullname, workemail, phonenumber, catergory, message, findus);
        res
            .status(201)
            .json({
            message: "Contact request submitted successfully",
            data: contact,
        });
    }
    catch (error) {
        // Handle unexpected errors
        console.error("Error in creating contact request:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred." });
        }
    }
});
exports.ContactUs = ContactUs;
