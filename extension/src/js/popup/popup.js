// code that will run when the extension icon is clicked.
const $ = require('jquery')
$(document).ready(()=>{
    $("#open-analytics")[0].onclick = () =>{
        chrome.runtime.getBackgroundPage((bgWindow) =>{
            bgWindow.openMediumForward();
            window.close();     // Close dialog
        });
    }
})
