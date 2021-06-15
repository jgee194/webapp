var express = require('express');
var router = express.Router();
const database = require('./database/database');
const db = database.db;
const cors = require("cors");
const bodyParser = require("body-parser");

router.use(cors());
router.use(bodyParser.json());


//search plans from hasPlan
const searchPlans = "SELECT plan.*, parkinglot.* FROM hasplan INNER JOIN plan ON plan.planId = hasplan.planId INNER JOIN parkinglot ON parkinglot.parkingLotId = hasplan.parkingLotId;"
//get all plans
router.get('/getPlans', async (req, res) => {
    await db.query(searchPlans, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

//search history for active overlapping plans
const searchOverlap = "SELECT * FROM history WHERE customerId = ? AND parkingLotId = ? AND carId =?"
const checkOverlap = (data) => {
    return new Promise((resolve, reject) => {
        db.query(searchOverlap, [data.user.id, data.plan.parkingLotId, parseInt(data.car)], (err, result) => {
            if (err) throw err;
            result.forEach((item) => {
                let currentTime = new Date();
                let existingEnd = new Date(item.endTime);
                if (existingEnd > currentTime) {
                    resolve(true);
                }
            })
            resolve(false);
        })
    })
}

//get plans from database
const findPlan = "SELECT history.*, parkinglot.parkingLotName FROM history INNER JOIN parkinglot ON parkinglot.parkingLotId = history.parkingLotId WHERE customerId = ?";
const getPlan = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(findPlan, userId, async (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

//enters plan into buy history
const buyPlan = "INSERT INTO history (carId, planId, customerId, parkingLotId, startTime, endTime) values (?, CONVERT_TZ(NOW(),'+00:00','+08:00'), DATE_ADD(CONVERT_TZ(NOW(),'+00:00','+08:00'), INTERVAL ? DAY));"
router.post('/buyPlan', async (req, res) => {
    if (await checkOverlap(req.body)) {
        res.status(200).send({ msg: "此車牌已有該停車場有效方案" });
        return;
    } else {
        let plan = req.body.plan;
        let user = req.body.user;
        let car = req.body.car;
        await db.query(buyPlan, [[parseInt(car), plan.planId, user.id, plan.parkingLotId], [plan.timeSpan]], async (err, result) => {
            if (err) throw err;
            let currPlans = await getPlan(user.id);
            res.status(201).send({
                msg: "購買成功!",
                plans: currPlans
            });
        })
    }
})

module.exports = router;