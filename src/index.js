const express = require("express");
const app = express();
const port = 3000;
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// parse incoming json
app.use(express.json());

// middleware
// app.use(auth);

// user router
app.use(userRouter);

//task router
app.use(taskRouter);

// server connection
app.listen(port, () => {
  console.log("server running on ", port);
});
