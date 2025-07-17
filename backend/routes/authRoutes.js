// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');

router.post('/signup', register);
router.post('/login', login);
router.post("/admin-login", adminLogin);
module.exports = router;
