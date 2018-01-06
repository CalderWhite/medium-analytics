// import & setup firebase
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAPNUxOVPUOABbeFkqbDice-tK3sTr9dds",
  authDomain: "medium-analytics.firebaseapp.com",
  databaseURL: "https://medium-analytics.firebaseio.com",
  projectId: "medium-analytics",
  storageBucket: "medium-analytics.appspot.com",
  messagingSenderId: "815409834711"
};
firebase.initializeApp(config);
// use the device's default language for all proceeding operations
firebase.auth().useDeviceLanguage();
let firebaseConnector = require('./app/firebaseConnector.js');
const firebaseUtils = new firebaseConnector.default(firebase);

const $ = require('jquery');
var userInfo = {
    username : null,
    userId : null,
    sessionId: null,
    email: null
}
var sendData = false;
function checkSendHeaders(details){
    let url = details.url;
    if(url.toLowerCase().search("_/api/stream") > -1){
        // this will contain the special cookies we need to get the analytics data
        let cookies = {};
        for(let i=0;i<details.requestHeaders.length;i++){
            if(details.requestHeaders[i].name.toLowerCase().search("cookie") > -1){
                let cookieTemp = details.requestHeaders[i].value.split(";");
                for(let j=0;j<cookieTemp.length;j++){
                    let [name,value] = cookieTemp[j].split("=");
                    // get rid of any trailing spaces
                    name = name.replace(/ /g,"");
                    cookies[name] = value;
                }
            }
        }
        // this is really the tricky token we need
        let sessionId = cookies["sid"];
        // user id is all over the place, but we'll pick it up here just to be concise
        let userId = cookies["uid"];
        // set values globally
        userInfo.userId = userId;
        userInfo.sessionId = sessionId;
        // if all the values are present, make the POST request
        if(userInfo.username != null){
            if(sendData){
                checkGoTo();
                sendData=false;
            }
        }
    }
}


chrome.webRequest.onSendHeaders.addListener(
    checkSendHeaders,
    {
        urls:['*://*.medium.com/*']
    },
    [
        'requestHeaders'
    ]
)
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if(request.username != undefined){
        userInfo.username = request.username;
        userInfo.email = request.email;
        if(userInfo.username != null && userInfo.userId != null && userInfo.sessionId != null){
            checkGoTo();
        }
    }
	return true;
});
chrome.runtime.onMessage.addListener((request, sender, callback) =>{
    if(request.message == 'open-analytics'){
        window.openAnalytics();
        if(request.closeCurrent){
            chrome.tabs.remove(sender.tab.id);
        }
    }
})
chrome.runtime.onMessage.addListener((request, sender, callback) =>{
    if(request.message == 'send-data'){
        if(userInfo.username != null && userInfo.userId != null && userInfo.sessionId != null){
            checkGoTo();
        } else{
            sendData=true;
        }
    }
})
chrome.runtime.onMessage.addListener((request, sender, callback) =>{
    if(request.message == 'close-me'){
        chrome.tabs.remove(sender.tab.id);
    }
})

function checkGoTo(){
    console.log("RUNNING CHECK GO TO")
    openAnalytics('saveData=true')
}

// functions accessable by other windows
window.openBasedOnCredentials = () => {
    // if the user info has already been gathered, do not re-gather it.
    if(userInfo.username != null){
        window.openAnalytics();
    } else{
        window.openAnalytics("forward-to-medium");
    }
}
window.openAnalytics = (queryString) => {
    console.log("Opening analytics...")
    if(!queryString){
        queryString = "";
    }
    chrome.tabs.create({url:chrome.extension.getURL('app/index.html?' + queryString)})
}
window.openPage = (url) =>{
    window.open(url);
}
window.getCurrentUserData = () =>{
    return userInfo
}
