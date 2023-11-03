{
    var timerId
    var flickerId

    function setted_parado(atz) {
        function flicker() {
            try {
                chrome.storage.local.get(["timerInicio"], function (items) {
                    if (items.timerInicio) {
                        setted_inicio()
                        return
                    }
                    setted_parado(true)

                    if (document.getElementById("btnTimerIniciar").className.includes("outline"))
                        document.getElementById("btnTimerIniciar").className = "btn btn-danger col-5"
                    else
                        document.getElementById("btnTimerIniciar").className = "btn btn-outline-danger col-5"
                })
            }
            catch {

            }
        }

        if (!atz) {
            clearInterval(timerId)
            flickerId = setInterval(flicker, 750)
        }

        document.getElementById("timerInicio").innerText = "00:00"
        document.getElementById("timerTotal").innerText = "00:00:00"
        document.getElementById("btnTimerParar").setAttribute("disabled", true)
    }
    function timer_parar() {
        chrome.storage.local.get(["timerInicio"], function (items) {
            if (!items.timerInicio) return

            let inicio = new Date(items.timerInicio)
            let final = new Date()
            let diff = Math.abs(inicio - final)
            let hours = (Math.floor(diff / 36e5))

            let data = {
                time_entry: {
                    issue_id: document.getElementById("timerIssue").innerText,
                    activity_id: document.getElementById("timerActivity").value,
                    comments: document.getElementById("timerComment").value,
                    hours: hours,
                }
            }
            window.top.postMessage(data, "*")
        })
    }
    document.getElementById("btnTimerParar").addEventListener("click", timer_parar)


    function setted_inicio(atz) {
        function atz_timer() {
            try {
                chrome.storage.local.get(["timerInicio"], function (items) {
                    if (!items.timerInicio) {
                        setted_parado()
                        return
                    }
                    setted_inicio(true)

                    let inicio = new Date(items.timerInicio)
                    let final = new Date()
                    let diff = Math.abs(inicio - final)
                    let hours = (Math.floor(diff / 36e5)).toString().padStart(2, "0")
                    let minutes = (Math.floor((diff % 36e5) / 6e4)).toString().padStart(2, "0")
                    let seconds = (Math.floor((diff % 6e4) / 1e3)).toString().padStart(2, "0")

                    document.getElementById("timerTotal").innerText = `${hours}:${minutes}:${seconds}`
                })
            }
            catch {

            }
        }

        if (!atz) {
            clearInterval(flickerId)
            timerId = setInterval(atz_timer, 1000)
        }

        let agr = new Date()
        document.getElementById("timerInicio").innerText = `${agr.getHours().toString().padStart(2, "0")}:${agr.getMinutes().toString().padStart(2, "0")}`
        document.getElementById("btnTimerIniciar").className = "btn btn-outline-danger col-5"
        document.getElementById("btnTimerParar").removeAttribute("disabled")
    }
    function timer_iniciar() {
        chrome.storage.local.get(["timerInicio"], function (items) {
            if (!items.timerInicio || confirm('Deseja reiniciar o timer?'))
                chrome.storage.local.set({ "timerInicio": (new Date()).toJSON() }, setted_inicio)
        })
    }
    document.getElementById("btnTimerIniciar").addEventListener("click", timer_iniciar)


    chrome.storage.local.get(["timerInicio"], function (items) {
        if (items.timerInicio)
            setted_inicio()
        else
            setted_parado()
    })


    function activity_change(event) {
        chrome.storage.local.set({ "timerActivity": event.target.value })
    }
    chrome.storage.local.get(["timerActivity"], function (items) {
        if (items.timerActivity) document.getElementById("timerActivity").value = items.timerActivity
    })
    document.getElementById("timerActivity").addEventListener("change", activity_change)


    if (location.search.substring(1))
        chrome.storage.local.set({ "timerIssue": location.search.substring(1) }, function () {
            document.getElementById("timerIssue").innerText = location.search.substring(1)
        })
    else
        chrome.storage.local.get(["timerIssue"], function (items) {
            if (items.timerIssue) document.getElementById("timerIssue").innerText = items.timerIssue
        })


    window.onmessage = function (event) {
        if (event.data.response) {
            chrome.storage.local.set({ "timerInicio": "" }, setted_parado)
            document.getElementById("timerAlertSuccess").children[0].innerText = "Tempo gasto: " + (Math.round(event.data.body.time_entry.hours * 100) / 100).toFixed(2) + " h"
            document.getElementById("timerAlertSuccess").removeAttribute("hidden")
            setTimeout(function () { document.getElementById("timerAlertSuccess").setAttribute("hidden", True) }, 1250)
        }
        else if (event.data.error) {
            document.getElementById("timerAlertDanger").children[0].innerText = event.data.error
            document.getElementById("timerAlertDanger").removeAttribute("hidden")
            setTimeout(function () { document.getElementById("timerAlertSuccess").setAttribute("hidden", True) }, 2250)
        }
    }
}