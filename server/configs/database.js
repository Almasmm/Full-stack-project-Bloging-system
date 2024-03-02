const mongoose = require("mongoose");
const connect_db = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect_db;
