const saveOptions = () => {
    chrome.storage.local.set({
        "redmineToken": document.getElementById("redmineToken").value,
        "checkObservadas": document.getElementById("checkObservadas").checked,
        "checkNome": document.getElementById("checkNome").checked
    })

    document.getElementById("alertSuccess").removeAttribute("style")
    setTimeout(function () {
        document.getElementById("alertSuccess").setAttribute("style", "display: none")    
    }, 3000);
}

const restoreOptions = () => {
    chrome.storage.local.get([
        "redmineToken",
        "checkObservadas",
        "checkNome"], function (items) {
            document.getElementById("redmineToken").value = items.redmineToken
            document.getElementById("checkObservadas").checked = items.checkObservadas
            document.getElementById("checkNome").checked = items.checkNome
        })
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("save").addEventListener("click", saveOptions)
