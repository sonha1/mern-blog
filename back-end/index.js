import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import routes from "./routes/index.route.js";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import { connectDb } from "./configs/db.js";
import SocketServer from "./SocketServer.js";
import Group from "./models/group.model.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // cross-origin resource sharing

connectDb();

// app.get("/findAllGroups", (req, res) => {
//   Group.find({})
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving groups.",
//       });
//     });
// });
routes(app);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  SocketServer(socket);
});

ExpressPeerServer(http, { path: "/" });

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    err: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

export default http;
