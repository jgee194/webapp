//database
const mysql = require('mysql');

var db_config = {
    connectionLimit: 10, 
    host: 'us-cdbr-east-02.cleardb.com', 
    user: 'b56624faca290b', 
    password: 'f222a152', 
    database: 'heroku_97b8e43e93effe7', 
    waitForConnections: true,
    multipleStatements: true

};

const db = mysql.createPool(db_config);

module.exports.db = db;