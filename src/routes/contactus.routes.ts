import { Router } from "express";
import { ContactUs } from "../controllers/contactUs.controller";

const router= Router();
router.post('/', ContactUs);

export default router;

