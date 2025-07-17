// backend/seedAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => seedAdmin())
  .catch((err) => console.error("MongoDB connection failed:", err));

async function seedAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin@123", // will be hashed by the pre-save hook
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created: admin@example.com / Admin@123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
    process.exit(1);
  }
}
