import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSidebarUsersList, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getSidebarUsersList);
router.get("/:id", protectRoute, getMessages);
router.post("/send-message/:id", protectRoute, sendMessage);

export default router;