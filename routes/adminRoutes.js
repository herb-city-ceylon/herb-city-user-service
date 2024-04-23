const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  confirmOrder,
  adminAuth,
  addAdmin,
} = require("../controllers/adminController");

router.route("/getAllOrders").post(getAllOrders);
router.route("/confirmOrder").post(confirmOrder);
router.route("/adminAuth").post(adminAuth);
router.route("/addAdmin").post(addAdmin);

module.exports = router;
