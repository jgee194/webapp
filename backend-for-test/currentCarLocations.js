var express = require('express');
var router = express.Router();
const database = require('./database/database');
const db = database.db;
const cors = require("cors");
router.use(cors());
router.use(express.json());



//fetch current active cars info
const searchCurrentCars = " select t.eventId ,t.carId,t.carNum,t.lat,t.lng,t.parkingLotName,t.parkingLotId from (select event.eventId ,car.carId,carNum,parkinglot.lat,parkinglot.lng,parkinglot.parkingLotName,parkinglot.parkingLotId from event INNER JOIN car  ON car.carId = event.carId INNER JOIN parkinglot ON parkinglot.parkingLotId = event.parkingLotId WHERE (car.customerId=? OR car.shareCustomerId = ?) AND car.status='active'  Order by eventId DESC) as t group by t.carId  ";
router.post('/findCurrentCars', (req, res) => {
    console.log(req.body.user.id);
    db.query(searchCurrentCars, [req.body.user.id, req.body.user.id], (err, result) => {
        if (err) throw err;
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        res.send(data);
        console.log(data);
    })
})
const CurrentCarloaction = " select t.carNum,t.parkingLotName,t.parkingLotId from (select event.eventId ,car.carId,carNum,parkinglot.lat,parkinglot.lng,parkinglot.parkingLotName,parkinglot.parkingLotId from event INNER JOIN car  ON car.carId = event.carId INNER JOIN parkinglot ON parkinglot.parkingLotId = event.parkingLotId WHERE (car.customerId=? OR car.shareCustomerId = ?) AND car.status='active' AND car.carId =? Order by eventId DESC) as t group by t.carId  ";
router.post('/selectedCurrentCarloaction', (req, res) => {
    console.log(req.body.user.id);
    console.log("yes");
    db.query(CurrentCarloaction, [req.body.user.id, req.body.user.id, req.body.car], (err, result) => {
        if (err) throw err;
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        res.send(data);
        console.log(data);
    })
})
module.exports = router;