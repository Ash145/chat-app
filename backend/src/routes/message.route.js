import express from "express"

const router = express.Router();

router.get("/send", (req, res) => {
    res.send("This is send message endpoint");
});

export default router;