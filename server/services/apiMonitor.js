const axios=require("axios");
const Api=require("../Models/apiModel");
const Apilog=require("../Models/apiLogModel");

const checkApi=async()=>{
    const AllApis=await Api.find();
    for(let api of AllApis){
        const start=Date.now();
        const prevStatus=api.status;
        try{
            const response=await axios.get(api.url,{timeout:5000});
            const time=Date.now()-start;
            api.status="UP";
            api.responseTime=time;
            api.lastChecked=new Date();
            // console.log(`Api Name is ${api.name} , api url is ${api.url} , status is ${api.status} , responsetime is ${api.responseTime} , lastChecked is ${api.lastChecked}`);

        }
        catch(error){
            api.status="DOWN";
            api.responseTime=null;
            api.lastChecked=new Date();
            // console.log(`Api Name is ${api.name} , api url is ${api.url} , status is ${api.status} , responsetime is ${api.responseTime} , lastChecked is ${api.lastChecked}`);

        }
        await api.save();

        if(prevStatus && prevStatus!==api.status){
            await Apilog.create({
                apiId:api._id,
                status:api.status,
                message:api.status=="DOWN"?"Api is not reachable":"Api recovered"

            })
            console.log("Api log created")
        }
    }
}
module.exports=checkApi;