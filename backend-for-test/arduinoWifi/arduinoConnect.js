mqtt = require('mqtt');
var client = mqtt.connect('mqtt://104.155.194.205:1883'); //Connect to MQTT server
client.subscribe('Gate/Backend',{qos:1});

const openDoor = () => {
    message = 'message';
    client.publish('Gate/Backend', message, { qos: 0, retain: true });
    console.log('opening door');
    
};

module.exports = openDoor;