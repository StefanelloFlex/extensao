function timer_cancelar() {
    
}

function atz_timer(){
    chrome.storage.local.get(['timerInicio'], function(items) {
        const novoTempo = (new Date()) - (new Date(items.timerInicio))
        document.getElementById("timerTotal").innerText = `${novoTempo.getHours()}`
    })
}

function timer_iniciar() {
    chrome.storage.local.set({'timerInicio': (new Date()).toISOString()}, function() {
        document.getElementById("btnTimerIniciarParar").className = 'btn btn-outline-success col-7'
        setInterval(atz_timer, 1000)
        clearInterval(flickerId)
    })
}
document.getElementById("btnTimerIniciarParar").addEventListener('click', timer_iniciar)


function flicker() {
    if (document.getElementById("btnTimerIniciarParar").className.includes('outline'))
        document.getElementById("btnTimerIniciarParar").className = 'btn btn-danger col-7'
    else
        document.getElementById("btnTimerIniciarParar").className = 'btn btn-outline-danger col-7'
}
var flickerId = setInterval(flicker, 750)
