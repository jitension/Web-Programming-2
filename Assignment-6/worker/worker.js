const redisConnection = require("./redis-connection");
const fs = require("fs");

let jsonData;

if (!jsonData) {
    let fileData = fs.readFileSync("html.json");
    jsonData = JSON.parse(fileData);
    console.log("Read JSON data on startup.")
}

redisConnection.on('getPersonByID:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let user = jsonData.filter(function (user) {
        return user.id == message.data.id;
    });

    if (user.length == 1) {
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: user[0],
            eventName: eventName
        });
    } else {
        let failedEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failedEvent, {
            requestId: requestId,
            data: { message: "User Not Found" },
            eventName: eventName
        });
    }
});

