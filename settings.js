const saveOptions=()=>{chrome.storage.local.set({redmineToken:document.getElementById("redmineToken").value,checkObservadas:document.getElementById("checkObservadas").checked,checkNome:document.getElementById("checkNome").checked},(function(){document.getElementById("alertSuccess").removeAttribute("style"),setTimeout((function(){document.getElementById("alertSuccess").setAttribute("style","display: none")}),2e3)}))},restoreOptions=()=>{chrome.storage.local.get(["redmineToken","checkObservadas","checkNome"],(function(e){document.getElementById("redmineToken").value=e.redmineToken,document.getElementById("checkObservadas").checked=e.checkObservadas,document.getElementById("checkNome").checked=e.checkNome}))};document.addEventListener("DOMContentLoaded",restoreOptions),document.getElementById("save").addEventListener("click",saveOptions);