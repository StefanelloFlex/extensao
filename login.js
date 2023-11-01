chrome.storage.local.get([
    "redmineUser",
    "redminePass"], function (items) {
        if (!items.redmineUser) return
        if (!items.redminePass) return

        document.getElementById("username").value = items.redmineUser
        document.getElementById("password").value = items.redminePass

        chrome.storage.session.get(["login"], function (items2) {
            if (items2.login) return
            document.forms[0].submit()
            chrome.storage.session.set({"login": true})
        })
    })
