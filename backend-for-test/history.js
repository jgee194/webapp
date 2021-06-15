var express = require('express');

var router = express.Router();
const database = require('./database/database')
const db = database.db;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');


router.use(cors());

router.use(bodyParser.json());

router.use(express.json());

router.use(cookieParser());

const selectEvent = 'SELECT parkinglot.parkingLotName, event.arrivalTime, event.departureTime FROM event INNER JOIN parkinglot ON event.parkingLotId = parkinglot.parkingLotId WHERE customerId = ?'

router.post("/event", async (req, res) => {
   
    try {
        let body = req.body;

        db.query(selectEvent, body, (err, result) => {
            if (err) throw err;
            console.log("connected");

            res.send(result);
        })

        //res.status(201).send("Car removed"); 

    } catch {
        res.status(500).send("Sorry. Unable to show.");
    }
});

module.exports = router;
