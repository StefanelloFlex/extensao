var firstTime = true
var listaObservadas = []
var listaNome = []


function callback(notificationId) {
    chrome.storage.local.get(["location", "protocol"], function (items) {
        if (!items.location) return
        chrome.tabs.create({ "url": items.protocol + "//" + items.location + "/redmine/issues/" + notificationId })
    })
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
        "protocol",
        "redmineToken",
        "checkObservadas",
        "checkNome"], function (items) {
            try {
                if (!items.protocol) return
                if (!items.location) return
                if (!items.redmineToken) return

                const options = { headers: { "X-Redmine-API-Key": items.redmineToken } }

                var novaListaObservadas = []
                if (items.checkObservadas) {
                    fetch(items.protocol + "//" + items.location + "/redmine/issues.json?set_filter=1&watcher_id=me&limit=100", options)
                        .then(r => { r.json() }).then(result => {
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
                        .catch((error) => { console.log(error) })
                }
                var novaListaNome = []
                if (items.checkNome) {
                    fetch(items.protocol + "//" + items.location + "/redmine/issues.json?set_filter=1&assigned_to_id=me&status_id=o&limit=100", options)
                        .then(r => r.json()).then(result => {
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
                        .catch((error) => { console.log(error) })
                }
            }
            finally {
                setTimeout(watchIssues, 10000)
            }
        })
}
watchIssues()
