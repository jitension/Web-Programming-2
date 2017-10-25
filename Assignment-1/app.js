const express = require("express");
let app = express();
let configRoutes = require("./routes");
let morgan = require("morgan");
var allPathsAccessed = {};

var bodyParser = require('body-parser');

app.use(morgan('tiny'));
app.use(function (req, res, next) {
    console.log("Current HTTP verb is:" + req.method);
    console.log("Requested route is:" + req.originalUrl);
    next();
});

app.use(function (req, res, next) {
    if (!allPathsAccessed[req.path])
        allPathsAccessed[req.path];
    allPathsAccessed[req.path]++;

    console.log(allPathsAccessed[req.path]);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(express.bodyParser());
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});