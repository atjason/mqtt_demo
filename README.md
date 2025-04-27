# MQTT Demo Project

This project demonstrates a simple MQTT-based communication system with three components:

## Project Structure

1. `mqtt-broker/`: MQTT Broker service using Aedes
   - Handles MQTT message routing
   - Manages client connections
   - Supports both TCP and WebSocket connections

2. `mqtt-server/`: Web-based MQTT server management interface
   - WebSocket server for management interface
   - MQTT client for monitoring and controlling other clients
   - Real-time client status updates

3. `mqtt-client/`: Mobile web client
   - Pure JavaScript implementation
   - Connects to MQTT broker via WebSocket
   - Receives and executes commands from server

## Port Configuration

- MQTT Broker:
  - TCP Port: 61883 (for server connections)
  - WebSocket Port: 61884 (for browser clients)
- Server WebSocket: 3000 (for management interface)
- Client Development Server: 8000 (Python HTTP server)

## Setup Instructions

1. Start the MQTT Broker:
   ```bash
   cd mqtt-broker
   npm install
   npm start
   ```
   The broker will start listening on:
   - TCP port 61883 for MQTT connections
   - WebSocket port 61884 for browser clients

2. Start the Server:
   ```bash
   cd mqtt-server
   npm install
   npm start
   ```
   The server will:
   - Connect to MQTT broker on port 61883
   - Start WebSocket server on port 3000

3. Start the Client:
   ```bash
   cd mqtt-client
   python3 -m http.server 8000
   ```
   The client will be available at http://localhost:8000

## Usage

1. Open the management interface:
   - URL: http://localhost:3000
   - This is where you can monitor and control clients

2. Open the mobile client:
   - URL: http://localhost:8000
   - Default broker URL: ws://localhost:61884
   - A random client ID will be generated automatically

3. To control a client:
   - Connect the mobile client to the broker
   - The client will appear in the management interface
   - Select the client and use the color buttons to change its background

## Development Notes

- The broker uses Aedes with WebSocket support via websocket-stream
- The server uses native WebSocket for the management interface
- The client uses the browser-compatible MQTT.js library
- All components use pure JavaScript without frameworks

## Security Considerations

The current implementation is for demonstration purposes and lacks security features. In a production environment, you should consider:

1. Adding authentication to the MQTT broker
2. Implementing SSL/TLS for encrypted connections
3. Adding message encryption for sensitive data
4. Implementing message signing for integrity verification 