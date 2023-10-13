chrome.storage.local.get(["checkWidth"], function (items) {
    if (!items.checkWidth) return

    const wrapper = document.getElementById("wrapper")
    wrapper.setAttribute("style", "max-width: none;")
})
