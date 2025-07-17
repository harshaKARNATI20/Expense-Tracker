const mongoose = require('mongoose');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// ✅ GET /api/admin/users → Get all regular users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch users' });
  }
};

// ✅ PUT /api/admin/block/:id → Block or unblock a user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You can't block yourself" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to update user' });
  }
};

// ✅ DELETE /api/admin/delete/:id → Permanently delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You can't delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '✅ User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to delete user' });
  }
};

// ✅ GET /api/admin/analytics → Fetch analytics for admin dashboard
exports.getAdminAnalytics = async (req, res) => {
  try {
    const topUsersData = await Expense.aggregate([
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" }
        }
      },
      {
        $group: {
          _id: "$userObjectId",
          totalExpense: { $sum: "$amount" },
        }
      },
      { $sort: { totalExpense: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          name: "$userInfo.name",
          totalExpense: 1,
        },
      },
    ]);

    const topCategoryData = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
      { $limit: 1 },
    ]);

    const totalIncomeResult = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenseResult = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      topUsers: topUsersData,
      topCategory: topCategoryData[0]
        ? { category: topCategoryData[0]._id, amount: topCategoryData[0].amount }
        : { category: 'N/A', amount: 0 },
      totalIncome: totalIncomeResult[0]?.total || 0,
      totalExpense: totalExpenseResult[0]?.total || 0,
    });
  } catch (err) {
    console.error('❌ Analytics error:', err);
    res.status(500).json({ message: 'Analytics fetch failed' });
  }
};
