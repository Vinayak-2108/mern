const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({path: './config.env'})

const db = process.env.DATABASE;
            //mongodb+srv://vinayak:2108@cluster0.bjtqe.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(db).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("No connection");
});

const middleware = (req, res, next)=>{
    console.log("Hello middleware");
    next();
}

app.get("/", (req,res)=>{
    res.send('Hello world')
});
app.get("/about",middleware, (req,res)=>{
    res.send('Hello about')
});

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
})