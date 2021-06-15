var express = require('express');
var router = express.Router();
const database = require('./database/database');
const db = database.db;
const Axios = require('axios');

//fetch cars for specific selected parking lot
const searchCarsForSelected = "SELECT car.carNum, car.carId FROM history INNER JOIN car ON car.carId = history.carId WHERE (history.customerId = ? and parkingLotId = ?) and history.endTime >= now() and car.status='inactive' ";
router.post('/findCarPlans', (req, res) => {
    console.log(req.body.user.id);
    console.log(req.body.selected.id);
    db.query(searchCarsForSelected, [req.body.user.id, req.body.selected.id], (err, result) => {
        if (err) throw err;

        res.send(result);
    })
})

//find shared cars for specific selected parking lot
const searchSharedCarsForSelected = "SELECT car.carNum, car.carId FROM history INNER JOIN car ON car.carId = history.carId WHERE (history.carId = ? and parkingLotId = ?) and history.endTime >= now() and car.status='inactive'";

const findSharedPlanPromise = (carId, locationId) => {
    return new Promise(async (resolve, reject) => {
        db.query(searchSharedCarsForSelected, [carId, locationId], (err, result) => {
            // console.log(result);
            if (err) reject(err);
            resolve(result)
        })
    })
}

router.post('/findSharedCarPlans', async (req, res) => {
    let resultArray = [];
    // console.log(req.body);
    for (i = 0; i < req.body.sharedCars.length; i++) {
        let result = await findSharedPlanPromise(req.body.sharedCars[i].carId, req.body.selected.id);
        if (result.length !== 0) {
            resultArray.push(result[0]);
        }
    }

    res.send(resultArray);
})


const writeArrivalTime = 'INSERT INTO event (customerId, parkingLotId, CarId, arrivalTime) values (?, CONVERT_TZ(NOW(),"+00:00","+08:00"));'
const updateStatus = 'UPDATE customer SET Status = ? WHERE CustomerId = ?';
const updateCarStatus = 'UPDATE car SET status = ? WHERE carId = ?';
const selectDevice = 'SELECT deviceNum, deviceKey FROM device WHERE parkingLotId = ?';

//send message to arduino via wifi
router.post('/openDoor', async (req, res) => {
    let user = req.body.user;
    let parkingLotId = await req.body.parkingLot.id

    db.query(selectDevice, [parkingLotId], (err, result) => {
        if (err)
            throw err;
        let deviceNum = result[0].deviceNum
        let deviceKey = result[0].deviceKey
        let iotAddress = "https://iot.cht.com.tw/iot/v1/device/" + deviceNum + "/command"
        Axios.post(iotAddress, [
            {
                "id": "entrance",
                "cmd": "open"
            }
        ], { headers: { "CK": deviceKey } })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    })

    db.query(updateCarStatus, ["active", req.body.car], (err, result) => {
        if (err) throw err;
        console.log("affectedRows: " + result.affectedRows);
    })

    await db.query(updateStatus, ["active", user.id], (err, result) => {
        if (err) throw err;
        console.log('opening door');
    })

    //write arrival time to database
    await db.query(writeArrivalTime, [[user.id, req.body.parkingLot.id, req.body.car]], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//gets last occurrence of customer event activity to update departure time
// const recordDeparture = 'UPDATE event SET departureTime = CONVERT_TZ(NOW(),"+00:00","+08:00") WHERE eventId = (SELECT * FROM (SELECT eventId FROM event WHERE eventId = (SELECT MAX(eventId) FROM event) AND carId = ?)event);'
// const recordTime = 'UPDATE event SET timeSpan = TIMEDIFF(departureTime, arrivalTime) WHERE eventId = (SELECT * FROM (SELECT eventId FROM event WHERE eventId = (SELECT MAX(eventId) FROM event) AND carId = ?)event);';
const recordDeparture = 'UPDATE event SET departureTime = CONVERT_TZ(NOW(),"+00:00","+08:00") WHERE eventId = (SELECT * FROM (SELECT MAX(eventId) as eventId FROM event WHERE carId=?)event)';
const recordTime = 'UPDATE event SET timeSpan = TIMEDIFF(departureTime, arrivalTime) WHERE eventId = (SELECT * FROM (SELECT MAX(eventId) as eventId FROM event WHERE carId=?)event)';
//changes status to inactive after leaving parking lot
//send exit request to iot platform
router.post('/exit', async (req, res) => {
    let user = req.body.user;
    let parkingLotId = await req.body.parkingLot
    let exitCar = await req.body.car
    db.query(selectDevice, [parkingLotId], (err, result) => {
        if (err)
            throw err;
        let deviceNum = result[0].deviceNum
        let deviceKey = result[0].deviceKey
        let iotAddress = "https://iot.cht.com.tw/iot/v1/device/" + deviceNum + "/command"
        Axios.post(iotAddress, [
            {
                "id": "exit",
                "cmd": "open"
            }
        ], { headers: { "CK": deviceKey } })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    })

    db.query(recordDeparture, exitCar, (err, result) => {
        if (err) throw err;
        res.send("door closed");
    })
    //write car status into db
    db.query(updateCarStatus, ["inactive", req.body.car], (err, result) => {
        if (err) throw err;
        console.log("affectedRows: " + result.affectedRows);
    })
    //write user status into db
    db.query(updateStatus, ["inactive", user.id], (err, result) => {
        if (err) throw err;

    })
    db.query(recordTime, exitCar, (err, result) => {
        if (err) throw err;
    })
})

module.exports = router;