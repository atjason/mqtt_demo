const WebSocket = require('ws');
const mqtt = require('mqtt');

const WS_PORT = 3000;
const MQTT_BROKER_URL = 'mqtt://localhost:61883';

// Connect to MQTT broker
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

// Connected clients
const connectedClients = new Map();

// Create WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

// MQTT Event Handlers
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('client/+/status');
});

mqttClient.on('message', (topic, message) => {
  const clientId = topic.split('/')[1];
  if (topic.endsWith('/status')) {
    const status = message.toString();
    if (status === 'online') {
      connectedClients.set(clientId, { id: clientId, status: 'online' });
    } else if (status === 'offline') {
      connectedClients.delete(clientId);
    }
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'clients-update',
          data: Array.from(connectedClients.values())
        }));
      }
    });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Web client connected');
  
  // Send initial client list
  ws.send(JSON.stringify({
    type: 'clients-update',
    data: Array.from(connectedClients.values())
  }));

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const { clientId, command, payload } = JSON.parse(message);
      if (connectedClients.has(clientId)) {
        mqttClient.publish(`client/${clientId}/command`, JSON.stringify({ command, payload }));
        ws.send(JSON.stringify({
          type: 'command-sent',
          success: true
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Client not found'
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
});

console.log(`WebSocket server running on port ${WS_PORT}`); 