// const express = require("express");
// const User = require("../models/User");
// const Income = require("../models/Income");
// const Expense = require("../models/Expense");
// const adminMiddleware = require("../middleware/adminOnly");

// const router = express.Router();

// // Get all users
// router.get("/users", adminMiddleware, async (req, res) => {
//   const users = await User.find({}, "-password");
//   res.json(users);
// });

// // Block/unblock user
// router.patch("/user/:id/block", adminMiddleware, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ error: "User not found" });

//   user.isBlocked = !user.isBlocked;
//   await user.save();
//   res.json(user);
// });

// // Delete user
// router.delete("/user/:id", adminMiddleware, async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// // Get expense/income stats
// router.get("/stats", adminMiddleware, async (req, res) => {
//   const income = await Income.find();
//   const expense = await Expense.find();

//   const totalIncome = income.reduce((acc, cur) => acc + cur.amount, 0);
//   const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);

//   res.json({ totalIncome, totalExpense });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminOnly = require('../middleware/adminOnly'); // ✅ correct import

// Admin-only protected routes
router.get('/users', adminOnly, adminController.getAllUsers);
router.put('/block/:id', adminOnly, adminController.toggleBlockUser);
router.delete('/delete/:id', adminOnly, adminController.deleteUser);
router.get('/analytics', adminOnly, adminController.getAdminAnalytics);
module.exports = router;




