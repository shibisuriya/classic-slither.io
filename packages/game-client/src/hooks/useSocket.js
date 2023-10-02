import React, { useState } from 'react';
const useSocket = () => {
	// useEffect(() => {
	// 	// For now I am going to be using a simple websocket server for
	// 	// developer & testing purposes.
	// 	// const { hostname, port } = window.location;
	// 	// const WS_PORT = 8085;
	// 	// socket.current = new WebSocket(`ws://${hostname}:${WS_PORT}`);
	// 	// socket.current.addEventListener('open', (event) => {
	// 	// 	console.log('WebSocket connection opened:', event);
	// 	// });
	// 	// socket.current.addEventListener('message', (event) => {
	// 	// 	const message = event.data;
	// 	// 	console.log('message -> ', message);
	// 	// });
	// 	// socket.current.addEventListener('close', (event) => {
	// 	// 	console.log('WebSocket connection closed:', event);
	// 	// });
	// 	// socket.current.addEventListener('error', (event) => {
	// 	// 	console.error('WebSocket error:', event);
	// 	// });
	// 	// return () => {
	// 	// 	// Disconnect...
	// 	// 	if (socket.current) {
	// 	// 		socket.current.close();
	// 	// 	}
	// 	// };
	// }, []);
};

export { useSocket };
