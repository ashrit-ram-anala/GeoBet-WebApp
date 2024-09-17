const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const mongoose = require('mongoose');
const corsOptions = {origin: ["https://geo-bet-web-app-frontend.vercel.app/"]};
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
    userDisplayName: String,
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
    const { userDisplayName, score, coins, questionsAnswered } = req.body;
    userModel.findOne({ userDisplayName })
        .then((existingUser) => {
            if (existingUser) {
                if (score > existingUser.score) {
                    existingUser.score = score;
                    existingUser.coins = coins;
                    existingUser.questionsAnswered = questionsAnswered;
                    
                    existingUser.save()

                }
            } else {
                const newUser = new userModel({
                    userDisplayName,
                    score,
                    coins,
                    questionsAnswered
                });
                
                newUser.save()
            }
        })
});

 
app.get("/", (req,res) =>{
    res.send("hello from the root file")
});

app.listen(PORT, ()=>{
    console.log('Listening on port 8080');
}); 

