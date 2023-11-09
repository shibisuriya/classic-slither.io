const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server that will serve as a WebSocket upgrade server
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('WebSocket server is running');
});

// Create a WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket server event handling
wss.on('connection', (ws) => {
	setInterval(() => {
		ws.send(Date.now().toString());
	}, 1 * 100);

	console.log('Client connected');

	// Handle incoming messages from clients
	ws.on('message', (message) => {
		console.log(`Received: ${message}`);

		// Broadcast the received message to all connected clients
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	// Handle client disconnection
	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

// Start the HTTP server on port 8080
const PORT = 8085;
server.listen(PORT, () => {
	console.log(`WebSocket server is listening on port ${PORT}`);
});
