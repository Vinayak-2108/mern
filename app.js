const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({path: './config.env'})
require('./db/conn');
// const User = require('./model/userSchema');
app.use(express.json());
app.use(require('./router/auth'));
const PORT = process.env.PORT;            

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

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})