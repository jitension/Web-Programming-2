
const startAPI = require("./start");

const constructorMethod = (app) => {
    app.use("/", startAPI);

};

module.exports = constructorMethod;