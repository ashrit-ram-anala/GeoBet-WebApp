const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const mongoose = require('mongoose');
const corsOptions = {origin: ["http://localhost:5173"]};
const PORT = '8080';

app.use(express.json())
app.use(cors(corsOptions));

app.get("/api/all", (req,res) =>{
    axios.get("https://opentdb.com/api.php?amount=25&category=22")
     .then((response) =>{
         res.json(response.data)
     })
     .catch((error)=>{
         console.log(error);
     })
 });

app.get("/api/easy", (req,res) =>{
   axios.get("https://opentdb.com/api.php?amount=25&category=22&difficulty=easy&type=multiple")
    .then((response) =>{
        res.json(response.data)
    })
    .catch((error)=>{
        console.log(error);
    })
});

app.get("/api/medium", (req,res) =>{
    axios.get("https://opentdb.com/api.php?amount=25&category=22&difficulty=medium&type=multiple")
     .then((response) =>{
         res.json(response.data)
     })
     .catch((error)=>{
         console.log(error);
     })
 });

 app.get("/api/hard", (req,res) =>{
    axios.get("https://opentdb.com/api.php?amount=25&category=22&difficulty=hard&type=multiple")
     .then((response) =>{
         res.json(response.data)    
     })
     .catch((error)=>{
         console.log(error);
     })
 });


mongoose.connect('mongodb+srv://ashritramanala:B70X2r9aRrrMaZvO@geo-betcluster.i4cvc.mongodb.net/?retryWrites=true&w=majority&appName=Geo-BetCluster');

const userSchema = new mongoose.Schema({
    score: Number,
    coins: Number,
    questionsAnswered: Number
})

const userModel = mongoose.model("test", userSchema)


app.get('/api/leaderboard', (req, res) => {
    userModel.find({})
        .sort({ score: -1 })
        .then(function(users) {
            res.json(users);
        })
        .catch(function(error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching leaderboard data' });
        });
});

app.post('/api/save-game', (req, res) => {
    const {score, coins, questionsAnswered } = req.body;
    const newGameData = new userModel({
        score,
        coins,
        questionsAnswered
    });

    newGameData.save()
        .then(() => {
            res.status(200).json({ message: 'Game data saved successfully!' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error saving game data', error });
        });
});

 
app.get("/", (req,res) =>{
    res.send("hello from the root file")
});

app.listen(PORT, ()=>{
    console.log('Listening on port 8080');
}); 
