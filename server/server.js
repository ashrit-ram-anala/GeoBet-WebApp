const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const mongoose = require('mongoose');
const corsOptions = {origin: ["http://localhost:5173"]};
const PORT = '8080';

app.use(express.json())
app.use(cors(corsOptions));

app.get("/api/all", (req,res) =>{ //main API endpoint to fetch questions of all difficulty in geography
    axios.get("https://opentdb.com/api.php?amount=25&category=22&type=multiple")
     .then((response) =>{
         res.json(response.data)
     })
     .catch((error)=>{
         console.log(error);
     })
 });

app.get("/api/easy", (req,res) =>{ //rest of these are for specific difficulties
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

 //mongoDB schema

mongoose.connect('mongodb+srv://ashritramanala:B70X2r9aRrrMaZvO@geo-betcluster.i4cvc.mongodb.net/?retryWrites=true&w=majority&appName=Geo-BetCluster');

const userSchema = new mongoose.Schema({
    userDisplayName: String,
    score: Number,
    coins: Number,
    questionsAnswered: Number
})

const userModel = mongoose.model("test", userSchema)

app.get('/api/leaderboard', (req, res) => { //sorts in decreasing order and fetches collection
    userModel.find({})
        .sort({ score: -1 }).limit(25)
        .then(function(users) {
            res.json(users);
        })
        .catch(function(error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching leaderboard data' });
        });
});

app.post('/api/save-game', (req, res) => {
    const { userDisplayName, score, coins, questionsAnswered } = req.body; //saves data to save-game only if the user beat their previous score if already present
    userModel.findOne({ userDisplayName })
        .then((existingUser) => {
            if (existingUser) {
                if (score > existingUser.score) {
                    existingUser.score = score;
                    existingUser.coins = coins;
                    existingUser.questionsAnswered = questionsAnswered;
                    
                    existingUser.save()

                }
            } else { //if user not present, then creates new user
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

app.get("/", (req,res) =>{ //default get endpoint to root
    res.send("hello from the root file")
});

app.listen(PORT, ()=>{ // port listener
    console.log('Listening on port 8080');
}); 
