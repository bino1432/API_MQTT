const express = require("express")
const server = express();

const mqtt = require('mqtt');

let mqttClient;

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
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    if (topic == "led/1"){
      MQTTObjeto.led1 = message.toString;
    }
  });
}

let MQTTObjeto = {
  led1: "",
  led2: "",
  led3: "",
  TempDef: "",
  TempAtl: ""
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

server.get("/", (req,res) => {
    return res.json({MQTTObjeto})
})

server.listen(3000, () => {
    console.log("Servidor online")
})