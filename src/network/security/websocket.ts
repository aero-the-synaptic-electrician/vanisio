let WebSocket = global.WebSocket;
(WebSocket.prototype as any).packetCount = 0;
if (production) {
    delete global.WebSocket;
}
export default WebSocket;