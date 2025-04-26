const aedes = require('aedes')()
const { createServer } = require('aedes-server-factory')
const port = 1883

const server = createServer(aedes)

server.listen(port, function () {
  console.log('MQTT Broker running on port:', port)
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