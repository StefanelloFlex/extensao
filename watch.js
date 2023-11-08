var firstTime = true
var listaObservadas = []
var listaNome = []
var ultimaNotificacaoExecucao = null
var ultimaExecucaoWatchIssues = null
var hostname = ""
var protocol = ""

chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" })

chrome.runtime.onMessage.addListener(function (location, sender, sendResponse) {
    hostname = location.hostname
    protocol = location.protocol
})

chrome.notifications.onClicked.addListener(function (notificationId) {
    if (!hostname) return
    if (!protocol) return

    if (notificationId == "andamento")
        chrome.tabs.create({ "url": protocol + "//" + hostname + "/redmine/issues?query_id=417" })
    else
        chrome.tabs.create({ "url": protocol + "//" + hostname + "/redmine/issues/" + notificationId })
})

function watchIssues() {
    chrome.storage.local.get([
        "redmineToken",
        "checkObservadas",
        "checkNome",
        "statusAndamento"], async function (items) {
            let agora = new Date()
            if (ultimaExecucaoWatchIssues != null && ((agora.getTime() - ultimaExecucaoWatchIssues.getTime()) / 60000) < 1)
                return
            ultimaExecucaoWatchIssues = agora

            if (!protocol) return
            if (!hostname) return
            if (!items.redmineToken) return

            const options = { headers: { "X-Redmine-API-Key": items.redmineToken } }

            if (items.checkObservadas) {
                var novaListaObservadas = []
                const observadas = await fetch(protocol + "//" + hostname + "/redmine/issues.json?set_filter=1&watcher_id=me&limit=100", options)
                const result = await observadas.json()

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
            }
            if (items.checkNome || items.statusAndamento) {
                var novaListaNome = []
                const atribuidas = await fetch(protocol + "//" + hostname + "/redmine/issues.json?set_filter=1&assigned_to_id=me&status_id=o&limit=100", options)
                const result = await atribuidas.json()

                listaNome.forEach(observada => {
                    result.issues.forEach(issue => {
                        if (observada.id == issue.id) {
                            novaListaNome.push(observada)
                            return
                        }
                    })
                })
                var andamento = 0
                result.issues.forEach(issue => {
                    let inserir = true
                    for (let index = 0; index < novaListaNome.length; index++) {
                        const observada = novaListaNome[index]
                        if (observada.id == issue.id) {
                            inserir = false
                            break
                        }
                    }
                    if (issue.status.id.toString() == items.statusAndamento) {
                        andamento++
                        if (andamento > 1 && items.statusAndamento)
                            notificarExecucao(andamento)
                    }
                    if (inserir) {
                        let novo = {
                            id: issue.id,
                            subject: issue.subject,
                            status: issue.status.id,
                            status_name: issue.status.name
                        }
                        novaListaNome.push(novo)
                        if ((!firstTime) && items.checkNome)
                            notificar(novo, 2)
                    }
                })
                if (andamento == 0 && items.statusAndamento)
                    notificarExecucao(andamento)
                firstTime = false
                listaNome = novaListaNome
            }
        })
}
setInterval(watchIssues, 5000)

function notificarExecucao(contagem) {
    let agora = new Date()
    if (ultimaNotificacaoExecucao != null && ((agora.getTime() - ultimaNotificacaoExecucao.getTime()) / 60000) < 5)
        return
    ultimaNotificacaoExecucao = agora

    let options = { type: "basic", iconUrl: "128.png" }
    if (contagem > 0) {
        options.title = "Mais de um chamado em andamento!\n"
        options.message = "Há mais de um chamado em andamento no seu nome. Verifique\n"
    }
    else {
        options.title = "Nenhum chamado em andamento!\n"
        options.message = "Você não possui chamado em andamento. Verifique\n"
    }
    chrome.notifications.create("andamento", options)
}

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
