// express
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const PORT = 8080
// using express v4, so we must include the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// my code
const AnalyticsEngine = require("./AnalyticsEngine.js")
const engine = new AnalyticsEngine("./medium-analytics-firebase.json");


app.listen(PORT, () => console.log('Medium Analytics server listening on ' + PORT.toString()));