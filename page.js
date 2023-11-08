chrome.runtime.sendMessage(location, null, (response) => { })

chrome.storage.local.get([
    "redmineToken",
    "checkTimer"], function (items) {
        if (!items.checkTimer) return
        if (!items.redmineToken) return

        var url = chrome.runtime.getURL("timer.html")
        const match = location.pathname.match(/[0-9]{5,6}/g)
        if (match)
            url += "?" + match[0]

        const frame = document.createElement("iframe")
        frame.id = "flexmobile_timer"
        frame.src = url
        frame.style.border = 0
        frame.style.backgroundColor = "transparent"
        frame.allowTransparency = "true"

        const sidebar = document.getElementById("sidebar")
        sidebar.insertBefore(frame, sidebar.children[0])

        window.onmessage = function (event) {
            const options = {
                method: "post",
                headers: { "X-Redmine-API-Key": items.redmineToken, "Content-Type": "application/json" },
                body: JSON.stringify(event.data),
            }
            fetch(location.protocol + "//" + location.hostname + "/redmine/time_entries.json", options)
                .then(response => response.text())
                .then((result) => {
                    if (JSON.parse(result).errors)
                        frame.contentWindow.postMessage({ "error": JSON.parse(result).errors[0] }, "*")
                    else {
                        frame.contentWindow.postMessage({ "response": result, "body": event.data }, "*")
                        location.reload()
                    }
                })
                .catch((error) => {
                    frame.contentWindow.postMessage({ "error": error }, "*")
                })
        }
    })
