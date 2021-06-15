var express = require('express');
var router = express.Router();
const database = require('./database/database')
const db = database.db;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs");
const{promisify} = require("util");
const pipeline  = promisify(require("stream").pipeline);
const bcrypt = require("bcrypt");
var vcode = "";
const Axios = require("axios");



router.use(cors());

router.use(bodyParser.json());

router.use(express.json());

router.use(cookieParser());


const selectCar = 'SELECT carNum FROM car WHERE customerId = ?';
//tries to find user from user database
const getDuplicateCars = (customerId, carNum) => {
    return new Promise((resolve, reject) => {
        db.query(selectCar, [customerId], (err, result) => {
            if (err) {
                reject(err);
                
                return;
            }
            let car = result;
            car.forEach(val => {
                if(val.carNum === carNum ){
                    resolve(true);
                }
                
            })
            resolve(false);
            
        })

        
    })
}

const selectAllCar = 'SELECT carNum FROM car';
//tries to find user from user database
const getDuplicateAllCars = (carNum) => {
    return new Promise((resolve, reject) => {
        db.query(selectAllCar , (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            let car = result;
            car.forEach(val => {
                if(val.carNum === carNum ){
                    resolve(true);
                }
                
            })
            resolve(false);
            
        })

        
    })
}



const upload = multer();
const insertCars = 'INSERT INTO car (customerId, carNum, status) VALUES (?)';
const imageUpload = "UPDATE car SET imagePath = ? WHERE carNum = ?"

//add cars. writes new cars into database
router.post("/addcars", upload.single('file'), async (req, res) => {
    try {
        let body = req.body;
        console.log(req.body.userId);
        const{
            file, 
            body: { name }
        } = req;

        //check valid file type
        const filetypes = [".jpeg", ".jpg", ".png"];
        if (!filetypes.find(element => element === file.detectedFileExtension)) {
            res.status(200).send("Invalid file type");
            return;
        }
     
        //check duplicate cars
        //console.log(await getDuplicateAllCars(body[0]));

        if (await getDuplicateAllCars(body.name)) {
            if (await getDuplicateCars(body.userId, body.name)) {
                res.status(200).send("Car already added");
            } else {
                res.status(200).send("Car already added by other user");
            }
        } else {
            db.query(insertCars, [[body.userId, body.name, "inactive"]], async (err, result) => {
                if (err) throw err;
                console.log("rows affected: " + result.affectedRows);
                const fileName = name + '-' + Date.now() + file.detectedFileExtension;
                await pipeline(file.stream, fs.createWriteStream(`./public/uploads/${fileName}`));

                db.query(imageUpload, [ fileName, req.body.name], (err, result) => {
                    if (err) throw err;
                    console.log("rows affected: " + result.affectedRows);
                })
            })
            res.status(201).send("Car added"); 
        }
    } catch {
        res.status(500).send("Sorry. Unable to add.");
    }
});

 const removeCars = ' DELETE FROM car WHERE carNum = ? ';

router.post("/removeCars", async (req, res) => {
    try {
        let body = req.body;


        db.query(removeCars, [body], (err, result) => {
            if (err) throw err;
            console.log("rows affected: " + result.affectedRows);
        })
        res.status(201).send("Car removed"); 

    } catch {
        res.status(500).send("Sorry. Unable to remove.");
    }
});

//share car from first owner
const shareCar = "UPDATE car SET shareCustomerId = (SELECT customerId FROM customer WHERE phone=? LIMIT 1) WHERE carId = CASE WHEN ((SELECT customerId FROM customer WHERE phone=? LIMIT 1) is not null) THEN ? ELSE null END";
router.post("/shareCar", (req, res) => {
    db.query(shareCar, [req.body.phone, req.body.phone, req.body.car.carId], (err, result) => {
        if (err) throw err;
        res.send({changed: result.changedRows, affected: result.affectedRows});
    })
})

//clear share car
const clearShareCar = "UPDATE car SET shareCustomerId = NULL where carId = ?"
router.post("/clearShareCar", (req, res) => {
    db.query(clearShareCar, [req.body.car.carId], (err, result) => {
        if (err) throw err;
        res.send("shared customer deleted")
    })
})



const selectPhone = 'SELECT * FROM customer WHERE customerId = ? ';
//tries to find phone from customer database
const getDuplicatePhone = (customerId, newPhone) => {
    return new Promise((resolve, reject) => {
        db.query(selectPhone, [customerId], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            let phone = result;
            phone.forEach(val => {
                if(val.phone === newPhone ){
                    resolve(true);
                }
                
            })
            resolve(false);
             
            
            
        })
        
    })
}
const updatePhone =  'UPDATE customer SET phone = ? WHERE customerId = ? ';

router.post("/phoneNum", async (req, res) => {
    try {
        let body = req.body;
        //check duplicate carss
        //console.log(await getDuplicatePhone(body[0], body[1]));
        if (await getDuplicatePhone(body[0], body[1])) {

            res.status(200).send("Phone number already added");  

        } else {
            db.query(updatePhone, [body[1], body[0]], (err, result) => {
                if (err) throw err;
                console.log("rows affected: " + result.affectedRows);
            })

            res.status(201).send("Phone number added");
            

        }
    } catch {
        res.status(500).send("Sorry. Unable to add.");
    }
});

const searchStatus = 'SELECT car.*, customer.name FROM car LEFT JOIN customer ON customer.customerId = shareCustomerId WHERE car.customerId = ?';

//sends updated user
router.post('/updated-car', (req, res) => {
    let user = req.body;
    db.query(searchStatus, user.id, (err, result) => {
        if (err) throw err;
        let car = result
        res.status(200).send(
            car
        );
    })
})

//updates shared cars (cars shared with current user)
const searchSharedCars = "SELECT carId, carNum, customerId, status FROM car WHERE shareCustomerId = ?";
router.post("/update-shared-cars", (req, res) => {
    let user = req.body;
    db.query(searchSharedCars, user.id, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})



const setPassword = "UPDATE customer SET password = ? WHERE phone = ? ";
router.post("/changePassword", async (req, res) => {
    try {
        let phone = await req.body.phone;
        let password = await req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(setPassword, [[hashedPassword], [phone]], (err, result) => {
        if (err) throw err;
        console.log("rows affected: " + result.affectedRows);
        })

         
    } catch {
        res.status(500).send("Sorry. Unable to Reset Password.");
    }
})

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



//verification. verify phone number
router.post("/verification", async (req, res) => {

    try {
      let phone = await req.body.phone;
      //check duplicate phones
      if (!(await getUser(phone))) {
        //send verification code
        vcode = generateVcode()
        parseInt(vcode);
        Axios.get("http://sms-get.com/api_send.php?", {
          params: {
            username: "kpclc8784712",
            password: "a25683383",
            method: "1",
            sms_msg: "您的vivipark驗證碼是" + vcode,
            phone: "" + phone,
          },
        })
          .then((vres) => {
            console.log(vres.data);
            if (vres.data.stats === true) {
              res.status(201).send({ vcode: parseInt(vcode)});
            } else {
              res.status(201).send("failed to send verification code");
            }
          })
          .catch((error) => {
            console.error(error);
            console.log("yoyoyo");
          });
      } else {
        res.status(200).send("該電話已被註冊");
      }
    } catch {
      res.status(500).send("抱歉, 無法更改電話");
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


module.exports = router;