const aedes = require('aedes')()
const { createServer } = require('aedes-server-factory')
const WebSocket = require('websocket-stream')
const http = require('http')
const port = 1883
const wsPort = 1884

// Create TCP server
const tcpServer = createServer(aedes)
tcpServer.listen(port, function () {
  console.log('MQTT Broker running on TCP port:', port)
})

// Create HTTP server for WebSocket
const httpServer = http.createServer()
WebSocket.createServer({ server: httpServer }, aedes.handle)

httpServer.listen(wsPort, function () {
  console.log('MQTT Broker running on WebSocket port:', wsPort)
})

// Handle client connect
aedes.on('client', function (client) {
  console.log('Client Connected:', client.id)
})

// Handle client disconnect
aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected:', client.id)
})

// Handle publish
aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Client', client.id, 'published', packet.payload.toString(), 'on', packet.topic)
  }
})

// Handle subscribe
aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('Client', client.id, 'subscribed to', subscriptions.map(s => s.topic).join(', '))
  }
}) 