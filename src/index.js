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

  let MQTTObjeto = {
    led1: "0",
    led2: "0",
    led3: "0",
    TempDef: "0.0",
    TempAtl: "0.0"
  }
  // Received Message
  mqttClient.on("message", (topic, message) => {
    
    if (topic == "led/1"){
      MQTTObjeto.led1 = message
    }
    if(topic == "led/2"){
      MQTTObjeto.led2 = message
    }
  
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
       + "\nO led 1 é: " + MQTTObjeto.led1 + "\nO led 2 é: " + MQTTObjeto.led2
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

server.get("/", (req,res) => {
    res.json(MQTTObjeto)
})

server.listen(3000, () => {
    console.log("Servidor online")
})