const express = require('express');
const router = express.Router();
const { validateLogin, validateRegister, handleValidationErrors } = require("../middleware/validators");
const authController = require("../controllers/authController");

router.post("/register", validateRegister, handleValidationErrors, authController.register);

router.post("/login", validateLogin, handleValidationErrors, authController.login);

router.get("/logout", authController.logout);

module.exports = router;
