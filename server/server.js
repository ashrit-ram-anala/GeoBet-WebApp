const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const corsOptions = {origin: ["http://localhost:5173"]};
const PORT = '8080';

app.use(cors(corsOptions));

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
 
app.get("/", (req,res) =>{
    res.send("hello from the root file")
});

app.listen(PORT, ()=>{
    console.log('Listening on port 8080');
}); 

