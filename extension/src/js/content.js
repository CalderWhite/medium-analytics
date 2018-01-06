const $ = require('jquery');
function findInScriptText(query,text){
    let found = "";
    let p = text.search(query)
    // there are other script tags with user profiles declared, the GLOBALS differentiates them
    if(text.search("GLOBALS") > -1 && p > -1){
        // add the the string we looked for to our position so we don't start at the u in username
        p+=query.length+1;
        // look through until we hit a quote (")
        let currentChar = text.charAt(p)
        while(currentChar != "\""){
            found+=currentChar;
            p++;
            currentChar=text.charAt(p);
        }
    }
    return found;
}
function getCurrentUserInfo(){
    let username;
    let email;
    let scripts = document.getElementsByTagName("script");
    for(let i=0;i<scripts.length;i++){
        // get text of script
        let text = scripts[i].textContent;
        // look for the javascript declaration of the currentUser's username
        let found = findInScriptText("\"username\":",text);
        if(found != ''){
            username = found;
        }
        found = findInScriptText("\"email\":",text);
        if(found != ''){
            email = found;
        }
    }
    return {username,email};
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function main(){
    chrome.runtime.sendMessage(getCurrentUserInfo(), (err) => {
        if(err != undefined && err != null){
            alert("[Medium Analytics] Error submitting medium data to server! More info in the developer console.")
            console.err(err);
        } else{
            // if there is a query parameter saying to forward this page to the dashboard application, do that
            if(getParameterByName('forward-to-medium-analytics',window.location.href) != null){
                chrome.runtime.sendMessage({message:'send-data'});
                chrome.runtime.sendMessage({message:'close-me'});
            }
        }
    });
}
// before any code is run, check if this is the domain selected to redirect to our app.
// (This is since firebase seems to not have support yet for chrome extension)
if(window.location.href.toString().search("calderwhite.github.io/medium-analytics/login") > -1){
    chrome.runtime.sendMessage({message:"open-analytics",closeCurrent:true},err=>{
        window.close();
    });
} else{
    $(document).ready(main)
}