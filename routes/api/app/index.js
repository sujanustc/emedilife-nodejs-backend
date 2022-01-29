const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
    res.json({ message: "App index router" });
});

router.use("/header-menu", require("../../header-menu"));

module.exports = router;
