var app = require('http').createServer(handler);
app.listen(3000);
var io = require('socket.io').listen(app);
var redis = require('redis');
var fs = require('fs');
const bodyParser = require("body-parser");

const bluebird = require('bluebird');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisConnection = require("./redis_connection");


var store = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        console.log("Listening on port 3000");
        res.end(data);
    });
}


io.sockets.on('connection', function (client) {
    console.log("connected");
    sub.subscribe("chatting");
    sub.on("message", function (channel, message) {
        console.log("message received on server from publish ");
        client.send(message);
    });
    client.on("message", function (msg) {
        console.log(msg);
        if (msg.type == "chat") {
            redisConnection.emit("send-message", {
                type: msg.type,
                user: msg.user,
                searchterm: msg.searchterm,
                message: msg.message
            });
        }
        else if (msg.type == "setUsername") {
            store.sadd("onlineUsers", msg.user);
        }
    });
    client.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting", "User is disconnected :" + client.id);
    });

    redisConnection.on("send-result", function (data) {

     //   pub.publish("chatting", "New result:");
       // pub.publish("chatting", "USER:" + data.user);
       // pub.publish("chatting", "Message:" + data.message);
        io.emit('image-data',JSON.stringify(data));    
    });
});