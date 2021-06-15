require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const database = require("./database/database");
const db = database.db;
const cookieParser = require("cookie-parser");

const auth = require("./auth");
const locations = require("./locations");
const doorActions = require("./doorActions");
const accounts = require("./accounts");
const shop = require("./shop");
const imageUploader = require("./imageUploader");
const history = require("./history");
const currentCarLocations = require("./currentCarLocations");


//to support https request
// const https = require('https');
// const fs = require('fs');
// const options = {
//     key: fs.readFileSync(`./backend-for-test.herokuapp.com-key.pem`),
//     cert: fs.readFileSync(`./backend-for-test.herokuapp.com.pem`)
// };

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.use(cookieParser());

app.get("/", function (req, res) {
    res.send("Hello vivipark (⁎⁍̴̛ᴗ⁍̴̛⁎)");
});
app.use("/api/auth", auth);

app.use("/api/locations", locations);

app.use("/api/doorActions", doorActions);

app.use("/api/accounts", accounts);

app.use("/api/shop", shop);

app.use("/api/history", history);

app.use("/api/imageUploader", imageUploader);

app.use("/api/currentCarLocations", currentCarLocations);

// public folder to upload files
app.use(express.static("./public"));

//for localhost to use https 
// const httpsServer = https.createServer(options, app);

//https default port 443
// httpsServer.listen(process.env.PORT || 443, function () {
//     console.log('it works (⁎⁍̴̛ᴗ⁍̴̛⁎)');
// });

app.listen(process.env.PORT || 3030, function () {
    console.log('it works ');
});