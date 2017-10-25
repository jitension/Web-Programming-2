const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const redisConnection = require("./redis-connection");
const nrp = require("./nrp-sender-shim");
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(bodyParser.json());


app.get("/api/people/:id", async (req, res) => {
    try {
        let response = await nrp.sendMessage({
            redis: redisConnection,
            eventName: "getPersonByID",
            data: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});