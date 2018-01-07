// express
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
// firebase
const AnalyticsEngine = require("./AnalyticsEngine.js")
const engine = new AnalyticsEngine("./medium-analytics-firebase.json");

const PORT = process.env.PORT || 8080;
// using express v4, so we must include the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const interval = 1000*60*60;

function updateUser(userCredentials){
    let {uid,username,userId,sessionId} = userCredentials;
    console.log("UPDATING:",uid);
    engine.addSnapshot(
        uid,
        username,
        userId,
        sessionId
    )
}
function serverInit(){
    // endpoints
    // recive new special tokens/ids so we can make requests to medium as the user
    app.post('/api/new_credentials', (req, res) => {
        let user = req.body;
        users.push(user);
        res.json({status_code:200,message:"OK"})
    });
    // Hello World endpoint
    app.get('/',(req,res) =>{
        res.json({status_code:200,message:"OK"})
    })
    updateLoop();
    app.listen(PORT, () => console.log('Medium Analytics server listening on ' + PORT.toString()));
}

// declare the users globally
let users = [];

engine.getUsers(userList=>{
    if(userList){
        users = Object.keys(userList).map(uid=>{
            let user = userList[uid]['medium-account'];
            user.uid = uid;
            return user;
        })
    }
    serverInit();
})
function updateUsers(){
    for(user of users){
        updateUser(user);
    }
}
function updateLoop(){
    updateUsers();
    setTimeout(updateLoop,interval);
}