const express = require("express");
// const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes.js');
const { connectDB } = require("./utils/db.js");
const userRoutes  = require("./routes/userRoutes.js");
const chatRoutes  = require("./routes/chatRoutes.js");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB()
});
