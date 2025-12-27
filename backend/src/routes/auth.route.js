import express from "express"

const router = express.Router();

router.get("/login", (req, res) => {
    res.send("This is login page");
});

router.get("/signup", (req, res) => {
    res.send("This is signup page");
});

export default router;