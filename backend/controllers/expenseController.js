const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      title,         // ✅ schema field
      amount,
      category,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("❌ Failed to add expense:", err);
    res.status(500).json({ message: err.message });
  }
};




exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ createdAt: -1 }); // ✅ fix field
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // ✅ fix field
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
