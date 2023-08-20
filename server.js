const express = require("express");
const path = require("path");
const lumie = require("lumie");
var bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const e = require("express");
const db = require("../../models/index");
const MessageModel = db.messages;
const UserGroupAssociationModel = db.user_group_associations;
const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
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
// Store all connected WebSocket clients in an array
const clients = [];
const roomIds = {};
const users = {};
wss.on("connection", (ws, req) => {
  let roomId = req.url.split("?")[0];
  roomId = parseInt(roomId.match(/\d+/)[0]);
  // Parse the URL and extract the query string
  const queryString = req.url.split("?")[1];

  // Parse the query string into an object using URLSearchParams
  const params = new URLSearchParams(queryString);

  // Get specific query parameters
  const userId = parseInt(params.get("userId"));
  const isGroup = params.get("group");
  console.log("Client connected to room ", roomId);
  const roomWs = roomIds[roomId] ?? [];
  const userWs = users[roomId] ?? [];
  roomIds[roomId] = [...roomWs, ws];
  users[roomId] = [...userWs, userId];

  console.log(users, userId, isGroup);
  // Add the new client to the array
  clients.push(ws);

  // Event listener for receiving messages from the client
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    storeMessage(roomId, userId, message);
    const roomClients = roomIds[roomId] ?? [];
    if (roomClients?.length) {
      for (const client of roomClients) {
        const index = clients.indexOf(client);
        if (
          index !== -1 &&
          client != ws &&
          client.readyState === WebSocket.OPEN
        ) {
          client.send(message);
        }
      }
    }
  });

  // Event listener for the client disconnecting
  ws.on("close", (error) => {
    console.log("Client disconnected", error);

    // Remove the disconnected client from the array
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

async function storeMessage(roomId, userId, message) {
  try {
    // eslint-disable-next-line
    console.log(roomId, userId, message);
    const [updatedOrCreatedRecord, created] = await MessageModel.upsert(
      { message },
      {
        where: {
          roomId,
          userId,
        },
      }
    );
    // Handle the updated or newly created record here
    console.log("Set Record:", updatedOrCreatedRecord.toJSON());
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
}

async function getMessage(roomId) {
  try {
    // eslint-disable-next-line
    console.log(roomId);
    const messages = await MessageModel.findAll({
      where: {
        roomId,
      },
    });
    // Handle the updated or newly created record here
    console.log("Get Record:", messages);
    return messages;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
}

const server = app.listen(8083, "0.0.0.0", () => {
  const { address, port } = server.address();
  console.log("Example app listening at http://%s:%s", address, port);
});
