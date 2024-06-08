require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
const app = express();
const cors = require("cors");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true }
});

const User = mongoose.model("User", userSchema);
  
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/leaderboard",async(req,res) => {
  User.find().sort({ score: -1 })
  .then(users => {
      res.status(200).json(users);
  })
  .catch(err => {
      res.status(500).json({ error: 'Internal server error' });
  });
});

app.post('/save',async (req, res) => {
    const { name, score } = req.body;

    try {
        await User.create({name,score});
        return res.status(200).json({success : "true"});
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});