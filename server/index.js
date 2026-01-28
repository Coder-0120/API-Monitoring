const express=require("express");
const connectDB = require("./config/db");
const cors=require("cors");
const cron=require("node-cron");
const checkApi=require("./services/apiMonitor");
const UserRoute=require("./Routes/userRoutes");
const ApiRoute=require("./Routes/apiRoutes");
const app=express();
app.use(express.json());
app.use(cors());
connectDB();
cron.schedule("*/1 * * * *", () => {
//   console.log("Checking APIs...");
  checkApi();
});
app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use("/api/user",UserRoute);
app.use("/api/monitor",ApiRoute);
app.use("/api/logs",ApiRoute);
app.listen(5000,()=>{
    console.log(`Server is running on port ${5000}`);
})
