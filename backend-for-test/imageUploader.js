var express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

var router = express.Router();
const database = require('./database/database')
const db = database.db;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const fs = require("fs");
const{promisify} = require("util");
const pipeline  = promisify(require("stream").pipeline);


router.use(cors());

router.use(bodyParser.json());

router.use(express.json());

router.use(cookieParser());





router.use(express.static('./public'));

const imageUpload = "UPDATE car SET imagePath = ? WHERE carNum = ?"

const upload = multer();
router.post("/upload", upload.single('file'), async (req, res, next) => {
    const{
        file, 
        body: { name }
    } = req;

    console.log("fatty")
    console.log(file.detectedFileExtension);
    const filetypes = [".jpeg", ".jpg", ".png"];
    if (!filetypes.find(element => element === file.detectedFileExtension)) {
        res.send("Invalid file type");
        return;
    }

    const fileName = name + '-' + Date.now() + file.detectedFileExtension;
    await pipeline(file.stream, fs.createWriteStream(`./public/uploads/${fileName}`));

    db.query(imageUpload, [ fileName, req.body.name], (err, result) => {
        if (err) throw err;
        // console.log("rows affected: " + result.affectedRows);
    })
});

module.exports = router;
