import gameObject from '.';
import connection from '@/network/connection';
import Player from './player';
import playerManager from './player-manager';
import settings from './settings';
import gameState from './state';
import {writeClientData, clampNumber} from './utils';
import {activeCells} from '@/cells/cell';

import SmartBuffer from '@/network/management/smart-buffer';

export class ActionManager {
    /** @param {number} [pid] */
    spectate(pid) {
        if (gameState.alive) return false;
        gameObject.spectating = true;
        const packet = SmartBuffer.fromSize(!!pid ? 3 : 1);
        packet.writeUInt8(2);
        !!pid && packet.writeInt16LE(pid);
        connection.send(packet);
    }

    join() {
        const packet = SmartBuffer.fromSize(1);
        packet.writeUInt8(1);
        writeClientData(packet);
        connection.send(packet);        
    }

    spectateLockToggle() { connection.sendOpcode(10); }

    /** @param {boolean?} [macro] */
    feed(state) {
        const macro = !!arguments.length;
        const packet = SmartBuffer.fromSize(macro ? 2 : 1);
        packet.writeUInt8(21);
        macro && packet.writeUInt8(+state);
        connection.send(packet);
    }
    
    /** @param {boolean} [state] */
    freezeMouse(state) {
		if (!gameObject.running) return;
		if (state === undefined) { state = !gameObject.mouseFrozen; }
        if (state) {
            this.stopMovement(false);
            this.lockLinesplit(false);
            gameObject.updateMouse(true);
            connection.sendMouse();
        }
        gameObject.mouseFrozen = state;
        gameObject.emit('update-cautions', {mouseFrozen:state});
	}

    /** @param {boolean} [state] */
    stopMovement(state) {
		if (!gameObject.running) return;
		if (state === undefined) { state = !gameObject.moveToCenterOfCells; }
        if (state) {
            this.freezeMouse(false);
            this.lockLinesplit(false);
        }
        this.moveToCenterOfCells = state;
        gameObject.emit('update-cautions', {moveToCenterOfCells:state});
	}

    /** @param {boolean} [state] */
    lockLinesplit(state) {
		if (!gameObject.running) return;
		if (state === undefined) { state = !gameObject.stopMovePackets; }
        if (state) {
            gameObject.updateMouse();
            connection.sendMouse();
            connection.sendOpcode(15);
            this.freezeMouse(false);
            this.stopMovement(false);
        }
        gameObject.stopMovePackets = state;
        gameObject.emit('update-cautions', {lockLinesplit:state});
	}
    
    linesplit() {
        if (this.linesplitUnlock) {
            clearTimeout(this.linesplitUnlock);
        }
		this.freezeMouse(true);
        this.split(3);
		this.linesplitUnlock = setTimeout(() => {
			delete this.linesplitUnlock;
            this.freezeMouse(false);
		}, 1500);
	}

    /**
     * @param {number} count 
     * @param {number} [timeOut] 
     * @returns {void}
     */
    split(count, timeOut=0) {
        if (!gameObject.stopMovePackets) connection.sendMouse();
        if (!!timeOut) return void setTimeout(() => this.split(count), timeOut);
        const packet = SmartBuffer.fromSize(2);
        packet.writeUInt8(17);
        packet.writeUInt8(count);
        connection.send(packet);
        gameObject.splitCount += count;
        if (gameObject.splitCount <= 2) {
            gameObject.moveWaitUntil = performance.now() + 300;
        } else {
            gameObject.moveWaitUntil = 0;
            gameObject.splitCount = 0;
        }
    }

    /** @param {WheelEvent} e */
    zoom(e) {
        const speed = 1 - settings.cameraZoomSpeed / 100;
        let delta = 0;

        if (e.detail) {
            delta = e.detail / 3;
        } else if (e.wheelDelta) {
            delta = e.wheelDelta / -120;
        }

        const scale = Math.pow(speed, delta);
        gameObject.mouseZoom = clampNumber(gameObject.mouseZoom * scale, gameObject.mouseZoomMin, 1);
    }

    /** @param {number} l */
    setZoomLevel(l) {
        gameObject.mouseZoom = 0.8 / Math.pow(2, l-1);
    }

    /** @param {boolean} closest */
    findPlayerUnderMouse(closest) {
        const {x:mx, y:my} = gameObject.mouse;

        let closestDist=0;
        /** @type {Player?} */
        let player=null;

        const cells = [...activeCells.values()];
		cells.filter(cell=> !!cell.isPlayerCell).sort((a, b) => a.size-b.size).forEach(cell => {
			const dx = cell.x - mx;
			const dy = cell.y - my;
			const d = Math.sqrt(Math.abs(dx * dx + dy * dy)) - cell.size;

			if (closest) {
				if (d < closestDist) {
					closestDist = d;
					player = cell;
				}
			} else if (d <= 0) {
				closestDist = cell.size;
				player = cell;
			}
		});

		return player;
	}

    /** @param {boolean} [state] */
    toggleSkins(state) {
        if (state === undefined) { state = !settings.skinsEnabled; }
        settings.set('skinsEnabled', state);
        playerManager.invalidateVisibility();
    }

    /** @param {boolean} [state] */
    toggleNames(state) {
        if (state === undefined) { state = !settings.namesEnabled; }
        settings.set('namesEnabled', state);
        playerManager.invalidateVisibility();
    }

    /** @param {boolean} [state] */
    toggleMass(state) {
        if (state === undefined) { state = !settings.massEnabled; }
        settings.set('massEnabled', state);
        playerManager.invalidateVisibility();
    }

    /** @param {boolean} [state] */
    toggleFood(state) {
        if (state === undefined) { state = !settings.foodVisible; }
        settings.set('foodVisible', state);
        gameObject.scene.food.visible = state;
    }

    /** @param {boolean} [state] */
    toggleHud(state) {
        if (state === undefined) { state = !settings.showHud; }
        settings.set('showHud', state);
        gameObject.app.showHud = state;
    }
    
    /** @param {boolean} [state] */
    toggleChat(state) {
        if (state === undefined) { state = !settings.showChat; }
		settings.set('showChat', state);
        if (!gameObject.running) return;
        gameObject.emit('chat-visible', {visible:state});
    }

    toggleChatToast() {
        if (state === undefined) { state = !settings.showChatToast; }
		settings.set('showChatToast', state);
        if (!gameObject.running) return;
        gameObject.emit('chat-visible', {visibleToast:state});
	}
};

// Singleton instance.
const actionManager = new ActionManager();
global.actionManager = actionManager;

export default actionManager;