const express=require('express');
const router=express.Router();
const Api=require("../Models/apiModel");
const Apilogs=require("../Models/apiLogModel");

// to add api in db
router.post("/add",async(req,res)=>{
    try{
        const{name,url,status,responseTime,lastChecked}=req.body;
        const existApi=await Api.findOne({url});
        if(existApi){
            return res.status(400).json({message:"Api already exist"});
        }
        await Api.create({name,url,status,responseTime,lastChecked});
        return res.status(201).json({message:"Api created successfully.."});
    }
    catch(error){
        return res.status(400).json({message:"Internal Server error"});
    }
})

// to get all api 
router.get("/getall",async(req,res)=>{
    try{
        const api=await Api.find().sort({createdAt:-1});
        return res.status(201).json({message:"Api fetched successfully..",data:api});
    }
    catch(error){
        return res.status(400).json({message:"Internal Server error"});
    }
})

// to get api by particular id 
router.get("/get/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const existApi=await Api.findById(id);
        if(!existApi){
            return res.status(400).json({message:"Api doesn't exist"});
        }
        return res.status(201).json({message:"Api fetched successfully..",data:existApi});
    }
    catch(error){
        return res.status(400).json({message:"Internal Server error"});
    }
})

// to delete api 
router.delete("/delete/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        await Api.findByIdAndDelete(id);
        return res.status(201).json({message:"Api deleted successfully.."});
    }
    catch(error){
        return res.status(400).json({message:"Internal Server error"});
    }
})

router.get("/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const alllogs=await Apilogs.find({apiId:id}).sort({createdAt:-1});
        return res.status(201).json({message:"All Api logs fetched successfully.. ",Apilogs:alllogs});
    }
    catch(error){
        return res.status(500).json({message:"Internal Server error"});
    }
})

module.exports=router;