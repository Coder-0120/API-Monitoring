const express=require("express");
const router=express();
const Apilogs=require("../Models/apiLogModel");

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

router.get("/uptime/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const sinceDate=new Date(Date.now()-24*60*60*1000);
        const logs=await Apilogs.find({
            apiId:id,
            createdAt:{
                $gte:sinceDate
            }
        });
        if(logs.length==0){
            return res.status(201).json({
                uptime:100,
                totalChecks: 0,
                upChecks: 0
            })
        }
        const upChecks=logs.filter(log=>log.status==='UP').length;
        const uptime=((upChecks/logs.length)*100).toFixed(2);
        return res.status(201).json({
            uptime:uptime,
            totalChecks:logs.length,
            upChecks:upChecks
        })
    }
    catch(error){
        return res.status(500).json({message:"Internal Server Error"});
    }
})

module.exports=router;