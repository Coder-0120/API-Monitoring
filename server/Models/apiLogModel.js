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
     responseTime: {
      type: Number,
      default: null
    },
    Errormessage:{
        type:String
    },
},{
    timestamps:true
})
module.exports=mongoose.model("Apilog",apilogSchema);