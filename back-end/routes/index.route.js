import userRoute from "./user.route.js";
import groupRoute from "./group.route.js";
import messageRoute from "./message.route.js";
import notifyRoute from "./notify.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js";

const routes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/group", groupRoute);
  app.use("/api/post", postRoute);
  app.use("/api/notify", notifyRoute);
  app.use("/api/message", messageRoute);
  app.use("/api/comment", commentRoute);
};

export default routes;
