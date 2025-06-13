/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_erp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;