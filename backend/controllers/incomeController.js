//incomeController.js
const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
  try {
    const { source, amount } = req.body;
    const income = await Income.create({
      user: req.user.id,
      source,
      amount,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
