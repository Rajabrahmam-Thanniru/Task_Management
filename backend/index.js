const express = require('express');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const port = process.env.port || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
