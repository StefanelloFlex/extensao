const saveOptions = () => {
    chrome.storage.local.set({
        "redmineToken": document.getElementById("redmineToken").value,
        "checkObservadas": document.getElementById("checkObservadas").checked,
        "checkNome": document.getElementById("checkNome").checked,
        "statusAndamento": document.getElementById("statusAndamento").value,
        "redmineUser": document.getElementById("redmineUser").value,
        "redminePass": document.getElementById("redminePass").value
    }, function () {
        document.getElementById("alertSuccess").removeAttribute("style")
        setTimeout(function () {
            document.getElementById("alertSuccess").setAttribute("style", "display: none")
        }, 2000)
    })
}

const restoreOptions = () => {
    chrome.storage.local.get([
        "redmineToken",
        "checkObservadas",
        "checkNome",
        "statusAndamento",
        "redmineUser",
        "redminePass"], function (items) {
            if (items.redmineToken) document.getElementById("redmineToken").value = items.redmineToken
            if (items.checkObservadas) document.getElementById("checkObservadas").checked = items.checkObservadas
            if (items.checkNome) document.getElementById("checkNome").checked = items.checkNome
            if (items.statusAndamento) document.getElementById("statusAndamento").value = items.statusAndamento
            if (items.redmineUser) document.getElementById("redmineUser").value = items.redmineUser
            if (items.redminePass) document.getElementById("redminePass").value = items.redminePass
        })
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("save").addEventListener("click", saveOptions)
