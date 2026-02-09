const express=require("express");
const router=express.Router();
const User=require("../Models/userModel");

// to register new user
router.post("/create",async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existuser=await User.findOne({email});
        if(existuser){
            return res.status(400).json({message:"User already registered with this email"});
        }
        await User.create({name,email,password});
        return res.status(201).json({message:"User registered successfully.."});
    }
    catch(error){
        return res.status(500).json({message:'Internal server error..'});
    }
})

// to login user
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existuser=await User.findOne({email});
        if(!existuser || existuser.password!=password){
            return res.status(400).json({message:"Invalid credentials"});
        }

        return res.status(201).json({message:"User logged in successfully..",data:{
            userId:existuser._id,
            user:existuser.name,
            email:existuser.email}});
    }
    catch(error){
        return res.status(500).json({message:'Internal server error..'});
    }
})

module.exports=router;