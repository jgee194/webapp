var express = require('express');
var router = express.Router();
const database = require('./database/database');
const db = database.db;

const selectLocations = 'SELECT * FROM parkinglot WHERE validDate<=CURDATE()';
//get loactions
const getLocations = () => {

    return new Promise((resolve, reject) => {
        db.query(selectLocations, (err, result) => {
            if (err) throw err;
            resolve(result);
        })
    })
}

//get request for all parking locations
router.get('/getLocations', async (req, res) => {
    let locations = await getLocations();
    res.send(locations);
})

module.exports = router;
