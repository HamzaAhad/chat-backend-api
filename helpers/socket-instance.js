const WebSocket = require("ws");
// models
const db = require("../models/index");
const TrackMessageModel = db.track_messages;

const { getMessage } = require("../helpers/get-messages-helper");
const { storeMessage } = require("../helpers/store-message-helper");
const { sendNotification } = require("../helpers/notification-helper");
module.exports.socketInstance = (wss) => {
  try {
    const clients = [];
    const roomIds = {};
    const userTrack = {};

    wss.on("connection", async (ws, req) => {
      let roomId = req.url.split("?")[0];
      roomId = parseInt(roomId.match(/\d+/)[0]);
      // Parse the URL and extract the query string
      const queryString = req.url.split("?")[1];

      // Parse the query string into an object using URLSearchParams
      const params = new URLSearchParams(queryString);

      // Get specific query parameters
      const userId = parseInt(params.get("userId"));
      const isGroup = params.get("group");
      console.log(`Client ${userId} connected to room `, roomId);
      const roomWs = roomIds[roomId] ?? [];
      roomIds[roomId] = [...roomWs, ws];

      // Add the new client to the array
      clients.push(ws);

      await TrackMessageModel.create({
        roomId: roomId,
        userId: userId,
      });

      userTrack[`${userId}-${roomId}`] = 1;
      const arr = await getMessage(roomId, userId);

      for (const content of arr) {
        ws.send(JSON.stringify(content));
        for (const content of arr) {
          console.log("sending", JSON.stringify(content));
          ws.send(JSON.stringify(content));
          await new Promise((resolve) => {
            ws.send(JSON.stringify(content), (error) => {
              if (error) {
                console.error("Error sending message:", error);
              }
              resolve();
            });
          });
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // Event listener for receiving messages from the client
      ws.on("message", async (message) => {
        const content = JSON.parse(message);
        console.log(`Received message: ${message} ${content?.roomId}`);

        const roomClients = roomIds[roomId] ?? [];
        // eslint-disable-next-line
        if (roomClients?.length) {
          for (const client of roomClients) {
            const index = clients.indexOf(client);
            if (
              index !== -1 &&
              client != ws &&
              client.readyState === WebSocket.OPEN
            ) {
              console.log("sending message via socket", message);
              client.send(
                JSON.stringify({
                  username: content?.username,
                  message: content?.message,
                  roomId: content?.roomId,
                  userId: content?.userId,
                  isGroup: content?.isGroup,
                  groupName: content?.groupName,
                })
              );
            }
          }
        }
        await storeMessage(parseInt(content?.roomId), userId, message);
        console.log(userTrack[`${userId}-${roomId}`]);
        if (userTrack[`${userId}-${roomId}`] == 1) {
          await sendNotification(message);
        }
        userTrack[`${userId}-${roomId}`] = 0;
      });

      // Event listener for the client disconnecting
      ws.on("close", async (error, reason) => {
        console.log(
          "Client disconnected",
          error,
          JSON.parse(JSON.stringify(reason))
        );
        console.log("destroy", roomId, userId);

        await TrackMessageModel.destroy({
          where: {
            roomId: roomId,
            userId: userId,
          },
        });

        // Remove the disconnected client from the array
        const index = clients.indexOf(ws);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
    });
    return true;

    // const sendMessage = send(notification);
  } catch (error) {
    console.log(error, "error");
    return false;
  }
};
