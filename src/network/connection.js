// const gameObject = require('../game');

import gameObject from '@/game';
import settings from '@/game/settings';
import gameState from '@/game/state';
import playerManager from '../game/player-manager';
import {writeClientData, logEvent, toast} from '../game/utils';
import {parseInitialData, parsePlayers} from './parsers';
import {parseCells} from '../wasm';
import KeyEncoder from './security/key-encoder';
import WebSocket from './security/websocket';

import SmartBuffer from './management/smart-buffer';

/**
 * @param {string} text 
 * @param {boolean} [error] 
 */
const notify = (text, error) => {
    toast.fire({
        icon: !!error ? 'error' : 'info',
        title: text,
        timer: !!error ? 5e3 : 2e3
    });
}

/** @type {AbortController?} */
let controller = null;

export class Connection {
    constructor() {
        /** @type {WebSocket?} */
        this.ws = null;

        /** @type {boolean} */
        this.opened = false;

        /** @type {number?} */
        this.socketId = null;

        /** @type {number} */
        this.socketCount = 0;
    }

    /**
     * @param {string} serverUrl
     * @returns {Promise<boolean>}
     */
    init(serverUrl) {
        return fetch(serverUrl, {
            credentials: 'omit',
            signal: controller.signal,
            headers: { Accept: 'text/plain' }
        })
        .then((r) => {
            const success = r.status === 200;
            if (!success) {
                notify('The connection was rejected!', true);
            }
            return success;                
        })
        .catch(() => {
            notify('A connection couldn\'t be established', true);
            return false;
        });
    }

    /** 
     * @param {string} gameUrl
     * @param {string?} whitelistUrl
     **/
    async open(gameUrl, whitelistUrl) {
        if (gameObject.running) {
            gameObject.stop();
        }
        if (!!controller) {
            controller.abort();
            controller = null;
        }

        controller = new AbortController();

        if (!(await this.init(whitelistUrl || gameUrl.replace('ws', 'http')))) return;

        this.close();
        gameObject.emit('chat-clear');
        
        this.opened = true;
        
        let socket = this.ws = new WebSocket(gameUrl, 'tFoL46WDlZuRja7W6qCl');
        socket.binaryType = 'arraybuffer';
        socket.packetCount = 0;
        
        socket.onopen = () => {
            if (!this.opened) return;
            this.socketId = socket.id = this.socketCount++;
            gameState.connectionUrl = gameUrl;
            socket.onclose = this.onClosed.bind(this);
        }
        
        socket.onclose = this.onRejected.bind(this);
        
        socket.onmessage = this.handleMessage.bind(this);
    }

    close() {
        const {ws:socket} = this;
        if (!socket) return;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close()
        this.ws = null
        gameState.connectionUrl = null;
        this.opened = false;
    }

    /** 
     * @param {string|ArrayBuffer|DataView|Uint8Array|SmartBuffer} data
     * @returns {boolean}
     */
    send(data) {
        if (data instanceof SmartBuffer) { data = data.view; }
        if (!this.opened) return false;
        const {ws:socket} = this;
        console.assert(!!socket, 'Socket not defined?');
        socket.send(data);
        return true;
    }

    /** @param {CloseEvent} e */
    onClosed(e) {
        this.socketId = null;
        this.opened = false;
        if (gameObject.running) gameObject.stop();
        /** @type {number} */
        let timeout;
        if (e.code === 1003) {
            timeout = 1500;
            notify('Server restarting...', false);
        } else {
            timeout = 3500 + ~~(100 * Math.random());
            let message = 'You have been disconnected';
            e.reason && (message += ` (${e.reason})`);
            notify(message, true);
        }
        setTimeout(() => {
            if (this.opened) return;
            gameObject.emit('reconnect-server');
        }, timeout);
        gameObject.showMenu(true);
    }

    onRejected() {
        this.socketId = null;
        this.opened = false;
        notify('Connection rejected', true);
    }

    /** @param {MessageEvent<ArrayBuffer>} m */
    handleMessage(m) {
        const packet = SmartBuffer.fromBuffer(m.data);
        const op = packet.readUInt8();
        // console.log('OP', op)
        switch (op) {
            case 1: {
                const data = parseInitialData(packet);
                gameObject.start(data);

                gameObject.mouseZoom -= 0.25;

                setTimeout(() => {
                    if (gameState.alive) return false;
                    gameObject.spectating = true;
                    connection.sendOpcode(2);
                }, 1500);
                return;
            }

            case 2: {
                const data = new Uint8Array(packet.buffer, 1);
                this.sendJoinData(new KeyEncoder(data).build());
                return;
            }

            case 3: {
                const elapsed = performance.now() - gameObject.pingStamp;
                logEvent(0, `[FRAME #${gameObject.frames}] Ping: ${Math.round(elapsed)}ms | FPS: ${Math.floor(gameObject.ticker.FPS)}`);
                return;
            }

			case 4: {
                /** @type {number} */
                let pid;
                while ((pid = packet.readUInt16LE()) !== 0) {
                    playerManager.remove(pid, true);
                }
                return;
			}

			case 6: {
				gameObject.connection.sendOpcode(6);
				return;
			}

            case 10: {
                gameObject.timeStamp = performance.now();
                const count = parseCells(packet);
                if (gameObject.cellCount != count) {
                    gameObject.emit('cells-changed', count);
                    gameObject.cellCount = count;
                }
                const alive = gameState.alive = count != 0;
                if (alive) {
                    gameObject.spectating = false;
                } else {
                    if (gameState.autoRespawning && ++gameObject.ticksSinceDeath === 37) {
                        gameObject.triggerAutoRespawn();
                    }
                }
                gameObject.updateCamera(true);
                playerManager.sweepRemovedPlayers();
                return;
            }

            case 16: {
                parsePlayers(packet); 
                return;
            }

			case 17: {
				const {camera} = gameObject;
				camera.spectator.set(
                    packet.readInt16LE(),
                    packet.readInt16LE()
                );
				return;
			}

            case 18: {
                gameObject.clearCells();
                return;
            }

            case 20: {
                gameState.deathDelay = true;

                if (settings.autoRespawn && !gameObject.app.showMenu) {
                    gameState.autoRespawning = true;
                    gameObject.ticksSinceDeath = 0;
                } else {
                    gameObject.deathTimeout = setTimeout(gameObject.triggerDeathDelay.bind(gameObject), 900);
                }

                return;
            }

			case 26: {
                gameState.playButtonDisabled = !!packet.readUInt8();
                if (packet.length > packet.offset+1) {
                    gameState.playButtonText = packet.readString() || 'Play';
                }
				return;
			}

            default: {
                return;
            }
        }
    }

    /** @param {number[]} key */
    sendJoinData(key) {
        const token = /^wss?:\/\/[a-zA-Z0-9_-]+\.vanis\.io/i.test(gameState.connectionUrl) ? localStorage.vanisToken : null;        
        const packet = SmartBuffer.fromSize(1 + 1 + key.length + (!!token ? token.length : 0));
        packet.writeUInt8(5);
        packet.writeUInt8(gameObject.clientVersion);
        key.forEach(n=>packet.writeUInt8(n));
        writeClientData(packet);
        if (!!token) {
            packet.writeStringNT(token);
        }
        this.send(packet);
    }

    sendMouse() {
        const {x:mx, y:my} = gameObject.mouse;
        const packet = SmartBuffer.fromSize(5);
        packet.writeUInt8(16);
        packet.writeInt16LE(mx);
        packet.writeInt16LE(my);
        this.send(packet);
    }

    /** @param {number} op */
    sendOpcode(op) {
        const packet = SmartBuffer.fromSize(1);
        packet.writeUInt8(op);
        this.send(packet);
    }

    /** @param {string} token */
    sendRecaptchaToken(token) {
        const packet = SmartBuffer.fromSize(1 + (token.length + 1));
        packet.writeUInt8(11);
        packet.writeStringNT(token);
        this.send(packet);
    }
    
    sendChatMessage(message) {
        message = unescape(encodeURIComponent(message));
        const packet = SmartBuffer.fromSize(1 + message.length);
        packet.writeUInt8(99);
        packet.writeString(message);
        this.send(packet);
	}
};


// Singleton instance.
const connection = new Connection();
export default connection;