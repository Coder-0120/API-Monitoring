const express=require('express');
const router=express.Router();
const Api=require("../Models/apiModel");
const Apilogs=require("../Models/apiLogModel");
const mongoose=require("mongoose");

// to add api in db
router.post("/add",async(req,res)=>{
    try{
        const{name,url,status,responseTime,lastChecked}=req.body;
        const existApi=await Api.findOne({url});
        if(existApi){
            return res.status(400).json({message:"Api already exist"});
        }
        const newApi=await Api.create({name,url,status:'UP',responseTime,lastChecked});
        return res.status(201).json({message:"Api created successfully..",data:newApi});
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

// delete api
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid API id" });
    }

    const deletedApi = await Api.findByIdAndDelete(id);

    if (!deletedApi) {
      return res.status(404).json({ message: "API not found" });
    }

    await Apilogs.deleteMany({ apiId: id });

    return res.status(200).json({
      success: true,
      message: "API deleted successfully"
    });

  } catch (error) {
    console.error("Delete API crash:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports=router;