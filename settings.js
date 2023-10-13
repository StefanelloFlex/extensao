const saveOptions = () => {
    chrome.storage.local.set({
        "redmineToken": document.getElementById("redmineToken").value,
        "checkObservadas": document.getElementById("checkObservadas").checked,
        "checkNome": document.getElementById("checkNome").checked,
        "checkWidth": document.getElementById("checkWidth").checked
    })

    document.getElementById("alertSuccess").removeAttribute("style")
    setTimeout(function () {
        document.getElementById("alertSuccess").setAttribute("style", "display: none")    
    }, 2000);
}

const restoreOptions = () => {
    chrome.storage.local.get([
        "redmineToken",
        "checkObservadas",
        "checkNome",
        "checkWidth"], function (items) {
            document.getElementById("redmineToken").value = items.redmineToken
            document.getElementById("checkObservadas").checked = items.checkObservadas
            document.getElementById("checkNome").checked = items.checkNome
            document.getElementById("checkWidth").checked = items.checkWidth
        })
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("save").addEventListener("click", saveOptions)
