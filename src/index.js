const express = require("express")
const server = express();
const cors = require("cors")

const mqtt = require('mqtt');

let mqttClient;

const objetoLed = {
  led1: 0,
  led2: 0,
  led3: 0
}

const objetoTemp = {
  TempDef: 0.0,
  TempAtl: 0.0
}

function connectToBroker() {
  const clientId = "bino1432";

  // Change this to point to your MQTT broker
  const hostURL = `mqtt://broker.mqttdashboard.com:1883`;

  // const options = {
  //   keepalive: 60,
  //   clientId: clientId,
  //   protocolId: "MQTT",
  //   protocolVersion: 4,
  //   clean: true,
  //   reconnectPeriod: 1000,
  //   connectTimeout: 30 * 1000,
  // };

  mqttClient = mqtt.connect(hostURL);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  // Received Message
  mqttClient.on("message", (topic, message) => {
    
    if (topic == "led/1"){
      objetoLed.led1 = message.toString()
    }
    if(topic == "led/2"){
      objetoLed.led2 = message.toString()
    }
    if (topic == "led/3"){
      objetoLed.led3 = message.toString()
    }
    if(topic == "temp/atl"){
      objetoTemp.TempAtl = message.toString()
    }
    if (topic == "temp/def"){
      objetoTemp.TempDef = message.toString()
    }

    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
  });
}



function subscribeToTopic(topic) {
  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic);
}

connectToBroker();
subscribeToTopic("led/1");
subscribeToTopic("led/2");
subscribeToTopic("led/3");
subscribeToTopic("temp/def");
subscribeToTopic("temp/atl");

server.use(express.json())
server.use(cors())

server.get("/led", (req,res) => {
    res.json(objetoLed)
})

server.get("/temp", (req,res) => {
  res.json(objetoTemp)
})

// server.listen(3000, () => {
//     console.log("Servidor online")
// })

const PORT = process.env.PORT || 8001
server.listen(PORT, () => {
  console.log("Servidor online")
})