chrome.runtime.sendMessage(location, null, (response) => { })

const frame = document.createElement("iframe")
frame.id = "flexmobile_timer"
frame.src = chrome.runtime.getURL("timer.html")
frame.style.border = 0;
frame.style.backgroundColor = "transparent";
frame.allowTransparency = "true";

const sidebar = document.getElementById("sidebar")
sidebar.insertBefore(frame, sidebar.children[0])