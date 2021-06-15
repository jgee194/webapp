require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const database = require("./database/database");
const db = database.db;
//web token
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const withAuth = require("./middleware");
const openDoor = require("./arduinoWifi/arduinoConnect");

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.use(cookieParser());

//checks token on Home page
app.post("/api/checkToken", withAuth, (req, res) => {
  res.sendStatus(200);
});

const insertUser = "INSERT INTO users (name, phone, password) VALUES (?)";

//registration. writes new users into database
app.post("/api/register", async (req, res) => {
  try {
    //hash password with salt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let body = req.body;

    //check duplicate emails
    if (!(await getUser(body.phone))) {
      db.query(
        insertUser,
        [[body.name, body.phone, hashedPassword]],
        (err, result) => {
          if (err) throw err;
          console.log("rows affected: " + result.affectedRows);
        }
      );
      //.catch(handleDisconnect())

      res.status(201).send("Registered!");
    } else {
      res.status(200).send("Phone already registered");
    }
  } catch {
    res.status(500).send("Sorry. Unable to Register.");
  }
});

const selectUser = "SELECT * FROM users WHERE phone = ? LIMIT 1";
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

//login. Assigns token to user frontend.
app.post("/api/login", async (req, res) => {
  //get user from database

  let user = await getUser(req.body.phone);

  //check if user exists
  if (user === null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    //check password
    if (await bcrypt.compare(req.body.password, user.password)) {
      //Issue token
      const payload = req.body.email;
      jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        res.json({
          token,
          user: user,
        });
      });
    } else {
      res.send("Invalid phone or password");
    }
  } catch {
    res.status(500).send();
  }
});

//send message to arduino via wifi
app.get("/api/openDoor", (req, res) => {
  openDoor();
});

const selectLocations = "SELECT * FROM locations";
//get loactions
const getLocations = () => {
  return new Promise((resolve, reject) => {
    db.query(selectLocations, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
    //.catch(handleDisconnect())
  });
};

//get request for all parking locations
app.get("/api/locations", async (req, res) => {
  let locations = await getLocations();
  res.send(locations);
});

app.listen(3030);
