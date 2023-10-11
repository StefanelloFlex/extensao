const history = document.getElementById("history")

const check = document.createElement("input")
check.setAttribute("type", "checkbox")
check.setAttribute("style", "margin-bottom: 10px; margin-left: -0.5px;")
check.setAttribute("id", "hide_details")
check.onchange = function (event) {
    for (const child of history.children) {
        if (child.getAttribute("class") != null) {
            if (child.getAttribute("class").indexOf("has-notes") == -1 || child.innerHTML.indexOf("<p>registro de tempo</p>") >= 0) {
                if (event.target.checked) {
                    child.setAttribute("style", "display: none;")
                }
                else {
                    child.removeAttribute("style")
                }
                chrome.storage.local.set({"checked": event.target.checked})
            }
        }
    }
}
chrome.storage.local.get(["checked"], function(items){
    if (items.checked) {
        check.click()
    }
})

const label = document.createElement("label")
label.setAttribute("for", "hide_details")
label.setAttribute("style", "margin-top: 2px;")
label.innerText = "Ocultar detalhes sem comentários"

const div = document.createElement("div")
div.setAttribute("style", "display: flex;")
div.appendChild(check)
div.appendChild(label)

for (const child of history.children) {
    if (child.nodeName != "H3") {
        history.insertBefore(div, child)
        break
    }
}
