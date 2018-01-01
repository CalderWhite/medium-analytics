// code that will run when the extension icon is clicked.
const $ = require('jquery')
$(document).ready(()=>{
    $("#open-medium")[0].onclick = () =>{
        chrome.runtime.getBackgroundPage((bgWindow) =>{
            bgWindow.openMedium();
            window.close();     // Close dialog
        });
    }
})
