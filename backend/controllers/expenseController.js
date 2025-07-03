const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { name, amount, category } = req.body;
    const expense = await Expense.create({
      user: req.user.id,
      name,
      amount,
      category,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
