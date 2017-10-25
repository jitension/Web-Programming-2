const express = require("express");
const app = express();
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten
const redis = require('redis');
var client = redis.createClient();
const data = require("./data");
const Dummy=data.dummy;
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



client.on('error', function (err) {
    console.log("Error " + err);
});

app.get("/api/people/history", async (req,res)=>{
    var docs=[];
    var i=0;
    let getlist=await client.lrangeAsync("recentlyviewed",0,20);
    console.log(getlist);
    if(getlist.length >= 20){

    for(i=0;i<20;i++){
        
        let getdata=await client.hgetallAsync(getlist[i]);
         docs.push(getdata);
    }
        res.json(docs);
    }else{
         res.json("There should be 20 visitors");
    }
    

})
app.get("/api/people/:id", async (req, res) => {
     var id=parseInt(req.params.id);
     let getuser=await client.hgetallAsync(id);
     if(getuser){
        console.log("Im in get");
        let pushlist=await client.lpushAsync(['recentlyviewed',id]);
        console.log(pushlist);
        res.json(getuser);
     }else{
         try{
        let getuserid=await Dummy.getById(id);
        let flatinfo=flat(getuserid);
        let setinfo=await client.hmsetAsync(id,flatinfo);
        console.log(setinfo);
        let pushdata=await client.lpushAsync(['recentlyviewed',id]);
        console.log(pushdata);
        res.json(getuserid);
         }catch(error){
             res.json(error);
         }
    }
})

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});