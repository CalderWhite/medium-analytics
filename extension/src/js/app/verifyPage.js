import "../../css/app/waitingVerification.css";

const $ = require('jquery');
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
let email = getParameterByName('email',window.location.href);
let domain = email.substring(email.search("@")+1,email.length);
let prefix = email.substring(0,email.search("@")+1);
$("#email")[0].textContent = prefix;
let link = document.createElement("a");
link.href = "https://" + domain;
link.textContent = domain;
$("#email")[0].appendChild(link);