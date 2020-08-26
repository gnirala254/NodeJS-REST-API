const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// const connString =
//   "mongodb+srv://gautamgypsnirala:" +
//   process.env.MONGO_ATLAS_PW +
//   "@cluster0.hhfq1.mongodb.net/apiDB?retryWrites=true&w=majority";
// mongoose.connect(connString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });
const connString =
  "mongodb://admin-gautam:" +
  process.env.MONGO_ATLAS_PW +
  "@" +
  "cluster0-shard-00-00.uokfg.mongodb.net:27017," +
  "cluster0-shard-00-01.uokfg.mongodb.net:27017," +
  "cluster0-shard-00-02.uokfg.mongodb.net:27017" +
  "/apiDB?authSource=admin&replicaSet=atlas-zaf4e8-shard-0&ssl=true";
mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handling CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works!",
//   });
// });

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
