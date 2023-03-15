const express = require("express");
const userRoute = require("./routers/user-routes");
var cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();
const sequelize = require("./Config/database");
const Users = require("./models/users");
const States = require("./models/states");
const Cities = require("./models/cities");
const Addresses = require("./models/addresses");
const BlackTokens = require("./models/blacktokens");

//To authenticate and connect with the database, so we can be sure if the connection is working fine or not.
sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
