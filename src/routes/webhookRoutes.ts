import express from "express";
import { handleWebhook } from "../controllers/webhookControllers";

const router = express.Router();

router.post("/webhook", handleWebhook);

export default router;
