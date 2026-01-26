const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/RealTime");
        console.log("Connected to database..");

    }
    catch(error){
        console.log(error);
    }
}
module.exports=connectDB;
