<template>
  <div class="app" :style="{ backgroundColor: backgroundColor }">
    <div class="container">
      <h1>MQTT Client</h1>
      
      <div class="connection-form" v-if="!isConnected">
        <div class="form-group">
          <label>Broker URL:</label>
          <input v-model="brokerUrl" placeholder="ws://localhost:1883" />
        </div>
        <div class="form-group">
          <label>Client ID:</label>
          <input v-model="clientId" placeholder="mobile_client_1" />
        </div>
        <button @click="connect" :disabled="connecting">
          {{ connecting ? 'Connecting...' : 'Connect' }}
        </button>
      </div>

      <div class="status-panel" v-else>
        <div class="status-item">
          <span class="label">Status:</span>
          <span class="value connected">Connected</span>
        </div>
        <div class="status-item">
          <span class="label">Client ID:</span>
          <span class="value">{{ clientId }}</span>
        </div>
        <div class="status-item">
          <span class="label">Broker:</span>
          <span class="value">{{ brokerUrl }}</span>
        </div>
        <button @click="disconnect" class="disconnect-btn">Disconnect</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import mqtt from 'mqtt'

const brokerUrl = ref('ws://localhost:1883')
const clientId = ref('mobile_client_' + Math.random().toString(16).substr(2, 8))
const isConnected = ref(false)
const connecting = ref(false)
const backgroundColor = ref('#ffffff')

let client = null

const connect = async () => {
  if (connecting.value) return
  connecting.value = true

  try {
    client = mqtt.connect(brokerUrl.value, {
      clientId: clientId.value,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    })

    client.on('connect', () => {
      isConnected.value = true
      connecting.value = false
      // Subscribe to commands
      client.subscribe(`client/${clientId.value}/command`)
      // Publish online status
      client.publish(`client/${clientId.value}/status`, 'online')
    })

    client.on('message', (topic, message) => {
      if (topic === `client/${clientId.value}/command`) {
        try {
          const command = JSON.parse(message.toString())
          if (command.command === 'setBackgroundColor') {
            backgroundColor.value = command.payload
          }
        } catch (e) {
          console.error('Failed to parse command:', e)
        }
      }
    })

    client.on('error', (err) => {
      console.error('Connection error:', err)
      connecting.value = false
    })
  } catch (err) {
    console.error('Failed to connect:', err)
    connecting.value = false
  }
}

const disconnect = () => {
  if (client) {
    client.publish(`client/${clientId.value}/status`, 'offline')
    client.end()
    client = null
    isConnected.value = false
  }
}

onUnmounted(() => {
  disconnect()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.connection-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.status-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-item {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
}

.value.connected {
  color: #4CAF50;
}

.disconnect-btn {
  background: #f44336;
  margin-top: 15px;
}

.disconnect-btn:hover {
  background: #d32f2f;
}
</style>
