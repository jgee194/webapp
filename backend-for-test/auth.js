var express = require("express");
var router = express.Router();
var vcode = "";
const database = require("./database/database");
const db = database.db;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const withAuth = require("./middleware");
const Axios = require("axios");
const { route } = require("./locations");
require("dotenv").config();

router.use(cors());

router.use(bodyParser.json());

router.use(express.json());

router.use(cookieParser());

//checks token on Home page
router.post("/checkToken", withAuth, (req, res) => {
  res.sendStatus(200);
});

const insertUser =
  'INSERT INTO customer (Name, Phone, Email, Password, Status, Credit) VALUES (?, "inactive", 0)';

//registration. writes new users into database
router.post("/register", async (req, res) => {
  try {
    //hash password with salt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let body = req.body;
    //check duplicate phones
    if (!(await getUser(body.phone))) {
      db.query(
        insertUser,
        [[body.name, body.phone, body.email, hashedPassword]],
        (err, result) => {
          if (err) throw err;
          console.log("rows affected: " + result.affectedRows);
        }
      );
      res.status(201).send("Registered!");
    } else {
      res.status(200).send("Phone already registered");
    }
  } catch {
    res.status(500).send("Sorry. Unable to Register.");
  }
});

//verification. verify phone number
router.post("/verification", async (req, res) => {
  try {
    let body = req.body;
    //check duplicate phones
    if (!(await getUser(body.phone))) {
      //send verification code
      Axios.get("http://sms-get.com/api_send.php?", {
        params: {
          username: "kpclc8784712",
          password: "a25683383",
          method: "1",
          sms_msg: "您的vivipark驗證碼是" + generateVcode(),
          phone: "" + body.phone,
        },
      })
        .then((vres) => {
          console.log(vres.data);
          if (vres.data.stats === true) {
            res.status(201).send({ vcode: parseInt(vcode) });
          } else {
            res.status(201).send("failed to send verification code");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      res.status(200).send("Phone already registered");
    }
  } catch {
    res.status(500).send("Sorry. Unable to Register.");
  }
});

//generate verification code
const generateVcode = () => {
  vcode = "";
  const codeLength = 6;
  const selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  for (var i = 0; i < codeLength; i++) {
    const charIndex = Math.floor(Math.random() * 10);
    vcode += selectChar[charIndex];
  }
  return vcode;
};

//check verification code 
// const checkVerfication = (verification) => { }

const selectUser = "SELECT * FROM Customer WHERE Phone = ? LIMIT 1";
//tries to find user from user database
const getUser = (phone) => {
  return new Promise((resolve, reject) => {
    db.query(selectUser, [phone], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      user = result[0];
      resolve(user);
    });
  });
};

//get cars from database
const findCars =
  "SELECT car.*, customer.name FROM car LEFT JOIN customer ON customer.customerId = shareCustomerId WHERE car.customerId = ?";
const getCars = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(findCars, userId, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

//get plans based on customer id
const findPlan = "SELECT history.*, car.carNum, parkinglot.parkingLotName FROM history INNER JOIN parkinglot ON parkinglot.parkingLotId = history.parkingLotId LEFT JOIN car ON history.carId = car.carId WHERE history.carId IN (select carId from car where customerId = ? or shareCustomerId = ?)";

const getPlan = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(findPlan, [[userId] ,[userId]], async (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

//update plans alone
router.post("/update-plans", async (req, res) => {
  let plan = await getPlan(req.body.user.id);
  res.send(plan)
})

//login. Assigns token to user frontend.
router.post("/login", async (req, res) => {
  //get user from database
  let user = await getUser(req.body.phone).catch((err) => console.log(err));
  //check if user exists
  if (user === null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    //check password
    if (await bcrypt.compare(req.body.password, user.password)) {
      //fetch cars and plans from db
      let cars = await getCars(user.customerId);
      let plan = await getPlan(user.customerId);
      //Issue token
      const payload = req.body.phone;
      jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        res.json({
          token,
          user: {
            id: user.customerId,
            name: user.name,
            phone: user.phone,
            email: user.email,
            status: user.status,
          },
          cars: cars,
          plan: plan,
        });
      });
    } else {
      res.send("Invalid phone or password");
    }
  } catch {
    res.status(500).send();
  }
});
const searchStatus = "SELECT * FROM customer WHERE CustomerId=?";
// const searchStatus = "SELECT customer.*, car.carId, car.carNum FROM customer LEFT JOIN car ON customer.customerId = car.shareCustomerId WHERE customer.customerId=?"

//sends updated user
router.post("/updated-user", (req, res) => {
  let user = req.body;
  db.query(searchStatus, user.id, (err, result) => {
    if (err) throw err;
    let person = result[0];
    res.status(200).send({
      id: person.customerId,
      name: person.name,
      email: person.email,
      phone: person.phone,
      status: person.status,
      shareCarId: person.carId,
      shareCarNum: person.carNum
    });
  })
})
///forget password
const selectPhone = 'SELECT phone FROM customer WHERE phone = ?';
const getPhone = (phone) => {
  return new Promise((resolve, reject) => {
    db.query(selectPhone, [phone], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      let match = result;
      console.log(match);
      match.forEach(val => {
        if (val.phone === phone) {
          resolve(true);
        }
      })
      resolve(false);

    })
  })
}
const updateForgetPassword = "UPDATE customer SET password = ? WHERE phone = ? ";
router.post("/forgetPassword", async (req, res) => {
  try {
    let body = await req.body;
    let password = generateVcode();
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(await getPhone(body[0]));
    console.log(body[0]);
    if (await getPhone(body[0])) {
      db.query(updateForgetPassword, [[hashedPassword], [body[0]]], (err, result) => {
        if (err) throw err;
        console.log("rows affected: " + result.affectedRows);
      })
      res.status(200).send(password);
    } else {
      res.status(201).send("Not Registered Yet !");
    }
  } catch {
    res.status(500).send("Sorry. Unable to Reset Password.");
  }
});

module.exports = router;
