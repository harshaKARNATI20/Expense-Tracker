// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ❌ Comment these until fixed
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
