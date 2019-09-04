const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({port: 9090})

let clients = []

wss.on('connection', (connection) => {
    clients.push(connection)
    broadcast({username: "admin", message: "A user has entered the room"})

    connection.on('message', (message) => {
        const data = JSON.parse(message)
        broadcast(data)
    })
})

setInterval(cleanUp, 100)

function broadcast(message) {
    const data = JSON.stringify(message)
    clients.forEach(client => client.send(data))
}

function cleanUp() {
    const clientsLeave = clients.filter(client => client.readyState === client.CLOSED)
    clients = clients.filter(client => client.readyState !== client.CLOSED)
    clientsLeave.forEach(client => broadcast({username: "admin", message: "A user has left the room"}))
}