var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonArrays = [],
    fileLoaded = false;

app.set('port', (process.env.PORT || 3001))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'))
    next();
});

app.get("/", (req, res) => {
    if (!fileLoaded)
        readJSONFile('./data.json', function (err, json) {
            console.log("loadiang JSON file.....")
            if (err) { throw err; }

            while (json.length > 0) {
                jsonArrays.push(json.splice(0, 25));
            }
            fileLoaded = true;
            res.json(jsonArrays[0]);
        })
    if (fileLoaded)
        res.json(jsonArrays[0]);
})

app.get("/data/:pageNumber", (req, res) => {
    var pageNumber = (req.params.pageNumber)

    if (!fileLoaded)
        readJSONFile('./data.json', function (err, json) {
            console.log("loadiang JSON file.....")
            if (err) { throw err; }

            while (json.length > 0) {
                jsonArrays.push(json.splice(0, 25));
            }
            fileLoaded = true;
            res.json(jsonArrays[pageNumber]);
        })
    if (fileLoaded)
        res.json(jsonArrays[pageNumber]);


});

app.get("/user/:pageNumber", (req, res) => {
    var pageNumber = (req.params.pageNumber)
        console.log(pageNumber)

    readJSONFile('./data.json', function (err, json) {
        console.log("inside user")
        if (err) { throw err; }
        json.map((each) => {
            if (each.id == pageNumber)
                res.json(each);

        })
    })


});

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}

app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})