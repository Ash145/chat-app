import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSidebarUsersList, getMessages, sendMessage, markMessagesSeen } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getSidebarUsersList);
router.put("/read/:id", protectRoute, markMessagesSeen);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;