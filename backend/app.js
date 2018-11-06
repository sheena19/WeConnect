const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require("./routes/posts");

const app = express();

mongoose.connect('mongodb+srv://sheena:jAHkzJ0aj9Q8Yk75@cluster0-1proa.mongodb.net/node-angular?retryWrites=true', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use((bodyParser.urlencoded({extended: false})));
app.use("/images", express.static(path.join("backend/images")));

//this is a middleware for CORS which allows across all domain and headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" //OPTIONS is called prior to post request
  );
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
