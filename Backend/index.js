const express = require("express");
const userRoute = require("./Routers/userRoutes");
var cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();
const cookieParser = require("cookie-parser");
const sequelize = require("./Config/database");
const Users = require("./Models/users");
const States = require("./Models/states");
const Cities = require("./Models/cities");
const Addresses = require("./Models/addresses");
//To authenticate and connect with the database, so we can be sure if the connection is working fine or not.
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

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
