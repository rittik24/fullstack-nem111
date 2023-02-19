const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
require("dotenv").config();
const {UserModel}=require("../models/User.model")
const express=require("express");
const userRouter=express.Router();
userRouter.use(express.json());    

userRouter.post("/register",async (req,res)=>{
    const {name,email,pass,age}=req.body;
    try{
        bcrypt.hash(pass, 5, async(err,secure_password)=>{
            try{
                const user=new UserModel({name,email,pass:secure_password,age});
                await user.save();
                res.send("Registere has been succesfull");
            }catch(err){
                console.log(err)
            }
        });
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

userRouter.post("/login",async (req,res)=>{
    const {email,pass}=req.body;
    try{
        const user=await UserModel.find({email});
        const hashed_pass=user[0].pass
        if(user.length>0){
            bcrypt.compare(pass, hashed_pass,(err,result)=>{
                if(result){
                    var token = jwt.sign({ userID:user[0]._id }, process.env.key);
                    res.send({"msg":"Login Success","token":token});

                }else{
                    res.send("Wrong Input");
                    console.log(err);
                }
            });
        }
    }catch(err){
        res.send("Something went wrong");
        console.log(err)
    }
})

userRouter.get("/data",(req,res)=>{
    const token=req.headers.authorization;
    // console.log(token)
    jwt.verify(token, process.env.key, (err,decode)=>{
        if(err){
            res.send("Invalid Input")
        }else{
            res.send("Data Page")
        }
    })
})

userRouter.get("/cart",(req,res)=>{
    const token=req.headers.authorization;
    // console.log(token)
    jwt.verify(token, process.env.key, (err,decode)=>{
        if(err){
            res.send("Invalid Input")
        }else{
            
            res.send("Cart Page")
        }
    })
})

module.exports={userRouter};