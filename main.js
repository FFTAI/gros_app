// main.js
const { app, BrowserWindow } = require("electron");
const { createServer } = require("http");
const express = require("express");
const server_app = express();
const os = require("os");

if (os.platform() === "win32") {
  dist = "dist";
}
const setup_server = (port) => {
  server_app.use("/", express.static(dist));
  const server = createServer(server_app);
  server.listen(port, async () => {
  });
};

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });

  let randomNumber = Math.floor(Math.random() * 65536);
  setup_server(randomNumber);
  win.loadURL(`http://localhost:${randomNumber}`);
});
