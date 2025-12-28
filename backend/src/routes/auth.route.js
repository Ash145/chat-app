import express from "express"
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", (req, res) => {
    res.send("This is login page");
});

router.post("/signup", signup);

export default router;