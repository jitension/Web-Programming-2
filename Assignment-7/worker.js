const redisConnection = require("./redis_connection");
const fetch = require('isomorphic-fetch');


redisConnection.on('send-message', (data, channel) => {
    console.log("\n\n\n=================")
    console.log(data);
    console.log("=================\n\n\n")

    var searchQuery = data.searchterm;
    var message = data.message;
    var user = data.user;
    var searchURL = "https://pixabay.com/api/?username=mjweaver01&key=1631539-db8210cabd2636c6df59812df&q=" + searchQuery + "&image_type=photo";
    console.log("search on progress" + searchURL)
    fetch(searchURL, { mode: 'cors' })
        .then(function (response) {
            return response.json();
        }).then((data) => {
            //  console.log(data);

            redisConnection.emit("send-result", {
                message: message,
                user: user,
                data: data,
               
            });
        })
});
