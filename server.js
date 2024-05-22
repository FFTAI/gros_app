const { createServer } = require("http");
const express = require("express");
const server_app = express();
server_app.use("/", express.static("dist"));
const server = createServer(server_app);

server.listen(8080, async () => {
  console.info("server running on: %s", "http://localhost:8080");
});

const dgram = require("dgram");
const Speaker = require("speaker");
const WebSocket = require("ws");
// const udpServer = dgram.createSocket("udp4");
const wss = new WebSocket.Server({ port: 8999 });
// const HOST = "192.168.9.185";
// const PORT = 8998; // 接收端口
const SAMPLE_RATE = 48000; // 采样率
const CHANNELS = 2; // 声道数

const audioFormat = {
  channels: CHANNELS,
  sampleRate: SAMPLE_RATE,
  bitDepth: 16,
  signed: true,
  float: false,
  endian: "little",
};
const speaker = new Speaker(audioFormat);

// udpServer.on("error", (err) => {
//   console.error(`UDP server error:\n${err.stack}`);
//   udpServer.close();
// });

// udpServer.on("message", (msg, rinfo) => {
//   // 接收到音频数据时，将其写入 speaker 播放
//   speaker.write(msg);
// });

// udpServer.on("listening", () => {
//   const address = udpServer.address();
//   console.log(`UDP server listening on ${address.address}:${address.port}`);
// });
// udpServer.bind(PORT);

wss.on("connection", function connection(ws) {
  // 当接收到来自客户端的消息时触发
  ws.on("message", function incoming(message) {
    // udpServer.send(message, 0, message.length, PORT, HOST, (err) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log("Audio chunk sent over UDP.");
    //   }
    // });
    console.log('接收的音频',message);
    speaker.write(message);
  });
});
