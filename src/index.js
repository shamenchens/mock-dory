const WebSocketServer = require('ws').Server;
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const server = require('http').createServer();

const jp = require('./fixtures/jp.json');
const kr = require('./fixtures/kr.json');
const th = require('./fixtures/th.json');
const tw = require('./fixtures/tw.json');

app.use(express.static(path.join(__dirname, '/public')));

function generateGlobalMessage() {
  const countryList = [jp, kr, th, tw];
  const countryLength = countryList.length;
  const fromCountry = countryList[Math.floor(Math.random() * countryLength)];
  const fromCity = fromCountry[Math.floor(Math.random() * fromCountry.length)];
  const toCountry = countryList[Math.floor(Math.random() * countryLength)];
  const toCity = toCountry[Math.floor(Math.random() * toCountry.length)];
  return { from: fromCity, to: toCity };
}

function generateJpMessage() {
  const fromCity = jp[Math.floor(Math.random() * jp.length)];
  const toCity = jp[Math.floor(Math.random() * jp.length)];
  return { from: fromCity, to: toCity };
}

const wss = new WebSocketServer({ server: server });
wss.on('connection', function (ws) {
  const id = setInterval(function () {
    const messages = [...new Array(Math.ceil(Math.random() * 10))].map(() => {
      return generateJpMessage();
    });
    console.log(messages);
    ws.send(JSON.stringify(messages), function () { /* ignore errors */ });
  }, 500);
  console.log('started client interval');
  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.on('request', app);
server.listen(port, function () {
  console.log(`Listening on ${port}`);
});
