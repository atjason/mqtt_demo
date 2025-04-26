# MQTT Demo Project

This project demonstrates a simple MQTT-based communication system with three components:

## Project Structure

1. `mqtt-broker/`: MQTT Broker service using Aedes
   - Handles MQTT message routing
   - Manages client connections

2. `mqtt-server/`: Web-based MQTT server management interface
   - Node.js backend with Express
   - Web interface for monitoring client connections
   - Control panel for sending commands to clients

3. `mqtt-client/`: Mobile web client
   - Responsive web interface
   - Connects to MQTT broker
   - Receives and executes commands from server

## Setup Instructions

1. Start the MQTT Broker:
   ```bash
   cd mqtt-broker
   npm install
   npm start
   ```

2. Start the Server:
   ```bash
   cd mqtt-server
   npm install
   npm start
   ```

3. Start the Client:
   ```bash
   cd mqtt-client
   npm install
   npm start
   ```

## Default Ports
- MQTT Broker: 1883
- Server Web Interface: 3000
- Client Development Server: 5173 