import gameState from './state';
import settings from './settings';
import renderer from '@/renderer';
import {circleManager, squareManager, virusTexture} from '@/renderer/texture-managers';
import Scene from '@/renderer/scene';
import SkinLoader from './skin-loader';
import Vector2 from '@/physics/vector2';
import {clampNumber, lerp, logEvent} from './utils';

import EventEmitter from 'events';

import * as PIXI from 'pixi.js';
import Cell, {activeCells, destroyedCells} from '@/cells/cell';

/**
 * @param {0|1|2} type 
 * @param {number} fontSize 
 * @returns {number}
 */
const getThickness = (type, fontSize) => {
    let result = 0;
    switch (type) {
        default: {            
            result = fontSize / 10;
            break;
        }

        case 1: {
            result = fontSize / 20;
            break;
        }

        case 3: {
            result = fontSize / 5;
            break;
        }
    }
    return Math.ceil(result);
}

/** @param {0|1|2} w */
const getFontWeight = (w) => {
    if (w === 0) return 'thin';
    else if (w === 1) return 'normal';
    else if (w == 2) return 'bold';
}

export class Game extends EventEmitter {
    constructor() {
        super();

        /** @type {boolean} */
        this.running = false;

        /** @type {number} */
        this.protocol;

        /** @type {number} */
        this.gamemodeId;

        /** @type {number} */
        this.instanceSeed;

        /** @type {boolean} */
        this.replaying;

        /** @type {number} */
        this.playerId;

        /** @type {number?} */
        this.multiboxPid;

        /** @type {number} */
        this.activePid;

        /** @type {number} */
        this.tagId;

        /** @type {boolean} */
        this.spectating = false;

        /** @type {boolean} */
        this.alive = gameState.alive = false;

        /** @type {Vector2} */
        this.centerPosition = new Vector2(0, 0);

        /** @type {number} */
        this.score = 0;

        /** @type {number} */
        this.highestScore = 0;

        /** @type {number} */
        this.serverTick;

        /** @type {number} */
        this.clientVersion = 30;

        this.renderer = renderer;

        /** @type {SkinLoader} */
        this.skinLoader = new SkinLoader();

        // load singleton virus sprite
        virusTexture.load(settings.virusImageUrl);

        /** @type {Settings} */
        this.settings = settings;

        /** @type {number} */
        this.timeStamp;

        /** @type {number} */
        this.pingStamp;

        /** @type {State} */
        this.state = gameState;

        /** @type {Connection} */
        this.connection;

        /** @type {ActionManager} */
        this.actions;
        
        /** @type {Map<number, Cell>} */
        this.cells = activeCells;

        /** 
         * Pre-allocated array for fast-storing cells during render cycle.
         * 
         * @type {Cell[]} */
        this.cellQueue = new Array(Math.pow(2, 15) - 1);

		/** @type {number} */
        this.cellCount = 0;

        /** @type {Set<Cell>} */
        this.ownedCells = new Set();

        /** @type {Vector2} */
        this.rawMouse = new Vector2();

        /** @type {Vector2} */
        this.mouse = new Vector2();

        /** @type {number} */
        this.mouseZoom;

        /** @type {number} */
        this.mouseZoomMin;

        /** @type {BorderData} */
        this.border;

        /** @type {FoodData} */
        this.food;

        /** @type {Camera} */
        this.camera;

        /** @type {PIXI.BitmapText[]} */
        this.massTextPool = [];
                    
        /** @type {PIXI.Sprite[]} */
        this.crownPool = [];

        /** @type {Scene?} */
        this.scene;

        /** @type {PlayerManager} */
        this.playerManager;

        /** @type {PIXI.Ticker?} */
        this.ticker = null;

        /** @type {number} */
        this.splitCount = 0;

        /** @type {number} */
        this.moveWaitUntil;

        /** @type {boolean} */
        this.stopMovePackets;

        /** @type {boolean} */
        this.mouseFrozen;

        /** @type {number?} */
        this.moveInterval;

        /** @type {number[]} */
        let intervals = this.intervals = [];
        intervals.push(setInterval((() => this.emit('every-second')), 1e3));        
        intervals.push(setInterval((() => this.emit('every-minute')), 6e4));

        /** @type {import('vue').App<Element>} */
        this.app;

        /** @type {number|undefined} */
        this.ticksSinceDeath;

        /** @type {number|undefined} */
        this.deathTimeout;

        /** @type {PIXI.TextStyle} */
        this.nameTextStyle;

        /** @type {PIXI.TextStyle} */
        this.massTextStyle;

        this.compileNameFontStyle();

        this.compileMassFontStyle();
    }

    /** @param {InitialData} data */
    start(data) {
        if (!data.protocol || !data.instanceSeed || !data.playerId || !data.border) {
            throw new Error('Lacking mandatory data');
        }

        this.running = true;

        this.protocol = data.protocol;

        this.gamemodeId = data.gamemodeId || 0;
        
        this.instanceSeed = data.instanceSeed;

        this.replaying = false;

        this.playerId = data.playerId;

        this.multiboxPid = null;

        /** @type {number} */
        this.activePid = data.playerId;

        this.tagId = null;

        this.spectating = false;

        this.alive = gameState.alive = false;

        this.centerPosition.reset();
        
        this.score = 0;

        this.highestScore = 0;

        this.serverTick = 0;

        this.timeStamp = 0;

        this.pingStamp = 0;        
        
        activeCells.clear();

        this.cellCount = 0;
        
        this.ownedCells.clear();

        destroyedCells.clear();

        this.rawMouse.reset();

        this.mouse.reset();

        this.mouseZoom = 0.3;

        this.mouseZoomMin = 0.01;

        let borderData = this.border = data.border;

        this.food = data.food;
        
		this.camera = {
			timeStamp: 0,
            spectator: new Vector2(),
            computedPosition: new Vector2(),
            oldPosition: new Vector2(borderData.x, borderData.y),
            newPosition: new Vector2(borderData.x, borderData.y),
			oldScale: this.mouseZoom,
			newScale: this.mouseZoom
		};

        this.massTextPool = [];

        this.crownPool = [];

        this.scene = new Scene(this, borderData);

        this.playerManager.reset();
        
        this.ticker = new PIXI.Ticker();
        this.ticker.add(this.onTick.bind(this));

        if (gameState.selectedServer && gameState.connectionUrl !== gameState.selectedServer.url) {
            gameState.selectedServer = null;
        }

        if (this.replaying) {

        } else {
            this.splitCount = 0;
            
            this.moveWaitUntil = 0;

            this.stopMovePackets = false;

            this.moveToCenterOfCells = false;

            this.mouseFrozen = false;

            if (settings.minimapEnabled) {
                ;
            }

            if (settings.showChat) {
                ;
            }

            this.emit('leaderboard-show');

            this.emit('stats-visible');

            this.moveInterval = setInterval(() => {
                if (this.stopMovePackets) return;
                if (this.moveToCenterOfCells) return void this.connection.sendOpcode(9);
                this.connection.sendMouse();
            }, 40);

            gameState.interactible = true;

            this.on('every-second', Game.everySecond);
        }
        
        this.frames = 0;

        this.ticker.start();

        this.emit('game-started');
    }

    stop() {
        if (!this.running) return;

        this.running = false;

        delete this.protocol;

        delete this.gamemodeId;
        
        delete this.instanceSeed;

        delete this.replaying;

        delete this.playerId;

        delete this.multiboxPid;

        delete this.activePid;

        delete this.tagId;

        this.spectating = false;

        this.alive = gameState.alive = false;

        this.centerPosition.reset();

        gameState.spectators = 0;

        gameState.interactible = false;

        gameState.playButtonDisabled = false;
        gameState.playButtonText = 'Play';
        
        this.score = 0;

        this.highestScore = 0;

        this.serverTick = 0;

        this.timeStamp = 0;

        this.pingStamp = 0;        

        this.clearCells();
        
        // console.log(this.cells, this.ownedCells, this.destroyedCells);

        this.rawMouse.reset();

        this.mouse.reset();

        delete this.mouseZoom;

        delete this.mouseZoomMin;

        delete this.border;

        delete this.food;

		delete this.camera;

        this.playerManager.reset();
        
        let {scene} = this;
        if (scene) {
            scene.destroyBackgroundImage(false);
            scene.uninstallMassTextFont();
            scene.container.destroy({children:true});
            delete this.scene;
        }

        this.renderer.clear();

        squareManager.reset();
        circleManager.reset();

        let q = this.massTextPool;
        while (q.length) q.pop().destroy(true);
        delete this.massTextPool;

        q = this.crownPool;
        while (q.length) q.pop().destroy();
        delete this.crownPool;

        delete this.splitCount;

        delete this.moveWaitUntil;

        delete this.stopMovePackets;

        delete this.moveToCenterOfCells;

        delete this.mouseFrozen;

        clearInterval(this.moveInterval);
        delete this.moveInterval;

        this.off('every-second', Game.everySecond);

        this.skinLoader.clearCallbacks();

        this.emit('minimap-stats-visible', true);
        this.emit('stats-visible', false);
        this.emit('chat-visible', {visible:false});
        this.emit('leaderboard-hide');
        this.emit('minimap-hide');
        this.emit('minimap-destroy');

        this.emit('show-replay-controls', false);

        this.emit('cells-changed', 0);

        this.emit('reset-cautions');
        
        delete this.frames;
        
        this.ticker.stop();
        this.ticker = null;
        
        this.emit('game-stopped');
    }
    
    static everySecond() {
        gameObject.pingStamp = performance.now();
        gameObject.connection.sendOpcode(3);
    }

    /** @param {boolean} [state] */
	showMenu(state) {
        const {app} = this;
        if (state === undefined) { state = !app.showMenu; }        
        app.showMenu = state; // use 'ui'

        logEvent(0, `Menu ${state ? 'opened' : 'closed'}`);

		if (state) {
			this.emit('menu-opened');
		} else {
			const node = document.activeElement;
			if (node && node.id !== 'chatbox-input') {
				renderer.view.focus();
			}
			this.stopMovePackets = false;
			// hideCaptchaBadge();
		}

		return state;
	}

    clearCells() {
        /** @type {Cell} */
        let cell;
        for (cell of activeCells.values()) {
            cell.destroy();
        }
        activeCells.clear();
        for (cell of destroyedCells.values()) {
            cell.destroySprite();
        }
        destroyedCells.clear();
    }

    triggerAutoRespawn() {
        gameState.deathDelay = false;
        gameState.autoRespawning = false;
        this.actions.join();
        delete this.ticksSinceDeath;
    }

    triggerDeathDelay() {
        clearTimeout(this.deathTimeout);
        delete this.deathTimeout;
        gameState.deathDelay = false;
        gameState.isAutoRespawning = false;
        this.showMenu(false);
        this.app.showDeathScreen = true;
    }
    
    onTick() {
        const now = this.timeStamp = performance.now();

        if (now >= this.moveWaitUntil) {
            this.updateMouse();
            this.splitCount = 0;
        }

        let {cellQueue:queue} = this;

        let destroyCount = destroyedCells.size, updateCount = activeCells.size;       

        let list = Array.from(destroyedCells);
        let position = 0;
        let limit = destroyCount;

        let chunkSize = 1023; /* (2^10)-1 */

        while (position < limit) {
            const chunk = list.slice(position, position += chunkSize);
            queue.unshift(...chunk);
        }
        
        list = Array.from(activeCells.values());
        position = 0;
        limit = updateCount;

        chunkSize = 8191; /* (2^13)-1 */

        while (position < limit) {
            const chunk = list.slice(position, position += chunkSize);
            queue.unshift(...chunk);
        }
                 
        const cellCount = destroyCount + updateCount;

        // Render each cell stored in pre-allocated cell queue.
        
        for (let index = 0; index < cellCount; index++) {
            let cell = queue[index];
            if (!cell.update(now) || !destroyedCells.has(cell)) continue;
            cell.destroySprite();
            destroyedCells.delete(cell);
        }
        
        queue.length = 0;

        this.scene.sort();
        
		let mass = this.updateCamera(false);
		if (mass !== NaN) {
			this.score = mass;
			this.highestScore = Math.max(mass, this.highestScore || 0);
		} else {
			this.score = 0;
			this.highestScore = 0;
		}

        renderer.render(this.scene.container);

        this.frames++;
    }

    compileNameFontStyle() {
        /** @type {PIXI.TextStyle} */
        let style = {        
            fontFamily: settings.cellNameFont,
            fontSize: 80,
            fontWeight: getFontWeight(settings.cellNameWeight)
        };

        if (!!settings.cellNameOutline) {
            style.stroke = parseInt(settings.cellNameOutlineColor, 16);
            style.strokeThickness = getThickness(settings.cellNameOutline, style.fontSize);
            style.lineJoin = settings.cellMassSmoothOutline ? 'round' : 'miter'
        }
        
        this.nameTextStyle = style;
    }

    compileMassFontStyle() {
        /** @type {PIXI.TextStyle} */
        let style = {
            fontFamily: settings.cellMassFont,
            fontSize: 56 + 20 * settings.cellMassTextSize,
            fontWeight: getFontWeight(settings.cellMassWeight),
            lineJoin: 'round',
            fill: parseInt(settings.cellMassColor, 16)
        };

        if (!!settings.cellMassOutline) {
            style.stroke = parseInt(settings.cellMassOutlineColor, 16);
            style.strokeThickness = getThickness(settings.cellMassOutline, style.fontSize);
            style.lineJoin = settings.cellMassSmoothOutline ? 'round' : 'miter';
        }
        
        this.massTextStyle = style;
    }
    
    /** 
     * @param {boolean?} [server]
     * @returns {number|undefined}
     */
    updateCamera(server) {
        const {camera} = this;

        const {oldPosition, newPosition} = camera; 

		let elapsedTime = (this.timeStamp - camera.timeStamp);
		const moveLerpFactor = clampNumber(elapsedTime / settings.cameraMoveDelay, 0, 1);
		const zoomLerpFactor = clampNumber(elapsedTime / settings.cameraZoomDelay, 0, 1);

        let stage = this.scene.container;

        let currentPosition = oldPosition.copy().lerp(newPosition, moveLerpFactor);
        stage.pivot.set(currentPosition.x, currentPosition.y);
        
		let scale = lerp(camera.oldScale, camera.newScale, zoomLerpFactor);
		stage.scale.set(scale);
        
		let newScale = this.mouseZoom;

        /** @type {Vector2} */
        let position;

        /** @type {number} */
        let score;
        
		if (this.spectating) {
            position = camera.spectator;

            score = NaN;
		} else {
            position = this.centerPosition;
            position.reset();

            score = 0;

			const {ownedCells} = this;

			if (ownedCells.size !== 0) {
                let radius = 0;
    
                /** @type {Cell} */
                let cell;
                for (cell of ownedCells) {
                    let mass = Math.round(Math.pow(cell.nSize/10, 2));
                    position.add(cell.nx*mass, cell.ny*mass);
                    score += mass;
                    radius += cell.nSize;
                }

                position.divide(score);
                
				if (settings.autoZoom) {
					newScale *= Math.pow(Math.min(64/radius, 1), 0.27);
				}
			} else {
                position.set(newPosition);

				/** @note Uncomment this to disallow zooming when the player is dead and isn't spectating */
				// newScale = camera.newScale;
			}
		}

        if (!server) return score;
        
        newPosition.set(position);
        camera.newScale = newScale;
        oldPosition.set(currentPosition);
        camera.oldScale = scale;
        camera.timeStamp = gameObject.timeStamp;
    }

	/** @param {boolean} [override] */
    updateMouse(override=false) {
		if (this.mouseFrozen && !override) return;
		const stage = this.scene.container;
		const {rawMouse, mouse} = this;
        mouse.set(
            clampNumber(stage.pivot.x + (rawMouse.x - window.innerWidth / 2) / stage.scale.x, -32768, 32767),
            clampNumber(stage.pivot.y + (rawMouse.y - window.innerHeight / 2) / stage.scale.y, -32768, 32767)
        );
	}


    /** @param {number} n */
    seededRandom(n) { return (n = Math.sin(n) * (10000+this.instanceSeed), n-Math.floor(n)); }
    
	/** 
	 * @param {number?} id 
	 * @returns {boolean}
	 **/
    setTagId(id) {
        id = id || 0;
		if (id === this.tagId) return false;
		this.tagId = id;
		return true;
    }

    /** 
     * @param {number} m
     * @returns {string}
     **/
    getMassText(m) {
        if (!settings.shortMass || m < 1000) return m.toFixed(0);
        return (m/1000).toFixed(1) + 'k';
    }
};

// Singleton instance.
let gameObject = new Game();

if (true || !production) {
    global.gameObject = gameObject;
}

export default gameObject;