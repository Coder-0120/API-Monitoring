const mongoose=require("mongoose");
const apilogSchema=new mongoose.Schema({
    apiId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Api",
        required:true
    },
    status:{
        type:String,
        enum:["UP","DOWN"],
        required:true
    },
    message:{
        type:String
    },
    checkedAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Apilog",apilogSchema);