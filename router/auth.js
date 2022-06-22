const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const User = require('../model/userSchema')

router.get('/', (req,res)=>{
    res.send('Hello world from router');
});

//* Using promises
// router.post('/register', (req,res)=>{
//     const {name, email, phone, work, password, cpassword} = req.body;
    
//     if(!name || ! email || ! phone || ! work || ! password || ! cpassword){
//         return res.status(422).json({error: "Please fill the field properly"});
//     }

//     User.findOne({email:email})
//     .then((userExists)=>{
//         if(userExists){
//             return res.status(422).json({error: "Email already exists"});
//         }

//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(()=>{
//             res.status(201).json({message: "User registered successfully"});
//         }).catch((err)=> res.status(500).json({error: "failed to register user"}));
//     }).catch(err => {console.log(err);});
// })

//*Async and await
router.post('/register', async(req,res)=>{

    const {name, email, phone, work, password, cpassword} = req.body;
    
    if(!name || ! email || ! phone || ! work || ! password || ! cpassword){
        return res.status(422).json({error: "Please fill the field properly"});
    }

    try{
        const userExists = await User.findOne({email:email})

            if(userExists){
                return res.status(422).json({error: "Email already exists"});
            }else if(password != cpassword){
                return res.status(422).json({error: "Invalid credentials"});
            }else{
                const user = new User({name, email, phone, work, password, cpassword});
        
                await user.save()
                
                res.status(201).json({message: "User registered successfully"});
            }
    }catch(err){
        console.log(err);
    };
});

router.post('/signin', async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({error: "please fill the fields"})
        }

        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);

        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })


            if(!isMatch){
                res.status(400).json({message: "User signin error"});
            }
            else{
                res.json({message: "User signin successful"});
            }      
        }
        else{
            res.status(400).json({message: "User signin error"});
        }
    }catch(err){
        console.log(err);
    }
})


module.exports = router;