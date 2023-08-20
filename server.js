const path = require("path");
const lumie = require("lumie");
const express = require("express");
var bodyParser = require("body-parser");

const cors = require("cors");
const WebSocket = require("ws");

// helpers
const { socketInstance } = require("./helpers/socket-instance");

// app
const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
lumie.load(app, {
  preURL: "api",
  verbose: true,
  ignore: ["*.spec", "*.action"],
  controllers_path: path.join(__dirname, "controllers"),
});
const wss = new WebSocket.Server({ port: 8080 });

/* initialing socket instance */
socketInstance(wss);

const server = app.listen(8083, "0.0.0.0", () => {
  const { address, port } = server.address();
  console.log("Example app listening at http://%s:%s", address, port);
});
