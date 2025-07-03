const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, deleteIncome } = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // protect all routes
router.post('/', addIncome);
router.get('/', getIncomes);
router.delete('/:id', deleteIncome);

module.exports = router;
