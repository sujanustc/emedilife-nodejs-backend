const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ message: "Web index router" });
});

router.use("/header-menu", require("../../header-menu"));
router.use("/order", require("../../order"))
router.use("/prescription", require("../../prescription"));
router.use("/shipping-charge", require("../../shipping-charge"))
router.use("/user", require('../../user'))

module.exports = router;
