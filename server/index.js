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

// recive new special tokens/ids so we can make requests to medium as the user
app.post('/api/new_credentials', (req, res) => {
    let {username,userId,sessionId} = req.body;
    engine.newSavedUser(username,userId,sessionId);
    res.json({status_code:200,message:"OK"})
});
// Hello World endpoint
app.get('/',(req,res) =>{
    res.json({status_code:200,message:"OK"})
})

app.listen(PORT, () => console.log('Medium Analytics server listening on ' + PORT.toString()));