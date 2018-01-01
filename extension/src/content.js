const $ = require('jquery');
function getCurrentUsername(){
    let username="";
    let scripts = document.getElementsByTagName("script");
    for(let i=0;i<scripts.length;i++){
        // get text of script
        let text = scripts[i].textContent;
        // look for the javascript declaration of the currentUser's username
        let p = text.search("\"username\"\:")
        // there are other script tags with user profiles declared, the GLOBALS differentiates them
        if(text.search("GLOBALS") > -1 && p > -1){
            // add the the string we looked for to our position so we don't start at the u in username
            p+="\"username\":".length+1;
            // look through until we hit a quote (")
            let currentChar = text.charAt(p)
            while(currentChar != "\""){
                username+=currentChar;
                p++;
                currentChar=text.charAt(p);
            }
        }
    }
    return username;
}
function main(){
    chrome.runtime.sendMessage({username:getCurrentUsername()}, (err) => {
        if(err != undefined && err != null){
            alert("[Medium Analytics] Error submitting medium data to server! More info in the developer console.")
            console.err(err);
        }
    });
}
$(document).ready(main)