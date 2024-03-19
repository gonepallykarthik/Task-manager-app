const mongoose = require("mongoose");
require("dotenv").config();

const username = encodeURIComponent(process.env.APP);
const pass = process.env.PASS;
const password = encodeURIComponent(pass);
const database = process.env.DATABASE_NAME;
const connectionUrl = `mongodb+srv://${username}:${password}@cluster0.9cosh.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster`;

mongoose
  .connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("successfully connected to the database"))
  .catch((err) => console.log("error connecting to database " + err));
