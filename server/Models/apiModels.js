const mongoose=require("mongoose");
const apiSchema =new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    url:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["UP",'DOWN'],
        default:"UP"
    },
    responseTime:{
        type:Number,
        default:0
    },
    lastChecked:{
        type:Date
    }

},{
    timestamps:true
});



module.exports=mongoose.model("Api",apiSchema);