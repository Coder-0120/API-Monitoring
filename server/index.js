const express=require("express");
const connectDB = require("./config/db");
const cors=require("cors");
const UserRoute=require("./Routes/userRoutes");
const app=express();
app.use(express.json());
app.use(cors());
connectDB();

app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use("/api/user",UserRoute);
app.listen(5000,()=>{
    console.log(`Server is running on port ${5000}`);
})
