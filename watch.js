var firstTime = true
var location = undefined
var redmineToken = undefined
var checkObservadas = false
var listaObservadas = []
var checkNome = false
var listaNome = []


function callback(notificationId) {
    chrome.storage.local.get(["location"], function (items) { location = items.location })
    if (!location) return
    chrome.tabs.create({ "url": "http://" + location + "/redmine/issues/" + notificationId })
}
chrome.notifications.onClicked.addListener(callback)

function notificar(issue, tipo) {
    let options = {
        type: "basic",
        title: "#" + issue.id + " - " + issue.subject,
        iconUrl: "128.png"
    }
    if (tipo == 1)
        options.message = "Mudou para a situação:\n"
    else if (tipo == 2)
        options.message = "Foi atribuído à você.\n"
    options.message += issue.status_name

    chrome.notifications.create(issue.id.toString(), options)
}

function watchIssues() {
    chrome.storage.local.get([
        "location",
        "redmineToken",
        "checkObservadas",
        "checkNome"], function (items) {
            location = items.location
            redmineToken = items.redmineToken
            checkObservadas = items.checkObservadas
            checkNome = items.checkNome
        })

    try {
        if (!location) return
        if (!redmineToken) return

        var header = { "headers": { "X-Redmine-API-Key": redmineToken } }

        var novaListaObservadas = []
        if (checkObservadas) {
            fetch("http://" + location + "/redmine/issues.json?set_filter=1&watcher_id=me&limit=100", header).then(r => r.json()).then(result => {
                listaObservadas.forEach(observada => {
                    result.issues.forEach(issue => {
                        if (observada.id == issue.id) {
                            novaListaObservadas.push(observada)
                            return
                        }
                    })
                })
                result.issues.forEach(issue => {
                    let inserir = true
                    for (let index = 0; index < novaListaObservadas.length; index++) {
                        const observada = novaListaObservadas[index]
                        if (observada.id == issue.id) {
                            inserir = false
                            if (observada.status != issue.status.id) {
                                novaListaObservadas[index].status = issue.status.id
                                novaListaObservadas[index].status_name = issue.status.name
                                notificar(novaListaObservadas[index], 1)
                            }
                            return
                        }
                    }
                    if (inserir) {
                        let novo = {
                            id: issue.id,
                            subject: issue.subject,
                            status: issue.status.id,
                            status_name: issue.status.name
                        }
                        novaListaObservadas.push(novo)
                    }
                })
                listaObservadas = novaListaObservadas
            })
        }

        var novaListaNome = []
        if (checkNome) {
            fetch("http://" + location + "/redmine/issues.json?set_filter=1&assigned_to_id=me&status_id=o&limit=100", header).then(r => r.json()).then(result => {
                listaNome.forEach(observada => {
                    result.issues.forEach(issue => {
                        if (observada.id == issue.id) {
                            novaListaNome.push(observada)
                            return
                        }
                    })
                })
                result.issues.forEach(issue => {
                    let inserir = true
                    for (let index = 0; index < novaListaNome.length; index++) {
                        const observada = novaListaNome[index]
                        if (observada.id == issue.id) {
                            inserir = false
                            return
                        }
                    }
                    if (inserir) {
                        let novo = {
                            id: issue.id,
                            subject: issue.subject,
                            status: issue.status.id,
                            status_name: issue.status.name
                        }
                        novaListaNome.push(novo)
                        if (!firstTime) notificar(novo, 2)
                    }
                })
                firstTime = false
                listaNome = novaListaNome
            })
        }
    }
    finally {
        setTimeout(watchIssues, 10000)
    }
}
watchIssues()
