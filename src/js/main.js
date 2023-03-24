/**
 * @author Aero
 * @version 1.0.0
 * @description The beginning of a fully open-sourced client that runs on 
 * the Vanis.io protocol with an independent renderer & deserializer. 
 */

// import: Authenticator.js

/** Array of numbers to be used as constant keys. */
const constants = [
	5, 0x68, 0xfd, 0x3e,
	0xaf, 0x74, 0xee, 0x29
];

class XorKey {
	/** 
	 * Initializes a key encoder, see example below:
	 * ```js 
	 * const key = [1,2,3,4,5,6,7,8,9,11,12,13];
	 * send(new XorKey(key).build());
	 * ```
	 * @param {Buffer | Array<number>} data Key value to be encoded
	 * @returns {XorKey} The key encoder instance
	 **/
	constructor(data) {
		/** @type {Buffer | Array<number>} */
		this.data = data;
	}

	/**
	 * Writes an encoded version of the given index to the output
	 * @param {Array<number>} output
	 * @param {number} index
	 * @private
	 */
	writeIndex(output, index) {
		const value = this.data[index];
		const mask = value + 5 & 7;
		const p1 = ((value << mask) | (value >>> (8 - mask))) & 0xff;
		const p2 = output[index > 0 ? index - 1 : 0] ^ constants[index];
		output.push((p1^p2) ^ 0x3e);
	}

	/**
	 * Constructs an encoded version of the current key
	 * 
	 * @param {boolean} [invert] 
	 * @returns {Array<number>}
	 */
	build(invert = false) {
		/** @type {Array<number>} */
		const result = [];

		for (let i = 0; i < 8; i++)
			this.writeIndex(result, i);

		const seed = 1 + Math.floor(0x7ffffffe * Math.random());
		result.push((result[0] ^ (seed >> 24)) & 0xff);
		result.push((result[1] ^ (seed >> 16)) & 0xff);
		result.push((result[2] ^ (seed >> 8)) & 0xff);
		result.push((seed ^ result[3]) & 0xff);

		result.push((result[0] ^ +invert) ^ 0x1f);

		return result;
	}
};

window.XorKey = XorKey;

// end of import

// import: SmartBuffer.js

class SmartBuffer {
	/**
	 * @param {ArrayBuffer | DataView} buffer
	 * @param {number} [offset]
	 */
	constructor(buffer, offset) {
		/** @type {DataView} **/
		this.view = null;

		if (buffer instanceof DataView) {
			this.view = buffer;
		} else {
			if (!(buffer instanceof ArrayBuffer)) {
				throw new TypeError('First argument to SmartBuffer constructor must be an ArrayBuffer or DataView');
			}

			this.view = new DataView(buffer);
		}

		this.offset = offset ?? 0;
	}

	/** @param {number} size */
	ensureCapacity(size) {
		const newSize = this.offset + size;

		if (newSize > this.length) {
			const buffer = new ArrayBuffer(newSize);

			const view = new Uint8Array(buffer);
			view.set(new Uint8Array(this.buffer));

			this.view = new DataView(buffer);
		}
	}

	/**
	 * @param {number} size
	 * @returns {SmartBuffer}
	 */
	static fromSize(size) {
		return new this(new ArrayBuffer(size), 0);
	}

	/**
	 * @param {ArrayBuffer} buffer
	 * @returns {SmartBuffer}
	 */
	static fromBuffer(buffer) {
		return new this(buffer, 0);
	}

	/** @returns {ArrayBuffer?} */
	get buffer() {
		return this.view?.buffer ?? null;
	}

	toBuffer() {
		return this.buffer;
	}

	/** @returns {number} */
	get length() {
		return this.view?.byteLength ?? -1;
	}

	/** @returns {boolean} */
	get eof() {
		return this.offset >= this.length;
	}

	/**
	 * Wrapper to call arbitrary read functions
	 * @param {function} callback The arbitrary reading function
	 * @param {number} size The amount of byte(s) to be consumed
	 * @param {boolean?} endianness The endianness for reading the value
	 * @param {number} offset Optional offset to be incremented by
	 * @returns {number}
	 */
	read(callback, size, endianness, offset) {
		const value = callback.call(this.view, offset ?? this.offset, endianness);

		if (!offset) {
			this.offset += size;
		}

		return value;
	}

	/**
	 * Wrapper to call arbitrary writing functions
	 * @param {function} callback The arbitrary reading function
	 * @param {number} size The amount of byte(s) to be consumed
	 * @param {number} value The value to be written
	 * @param {boolean} endianness The endianness for writing the value
	 */
	write(callback, size, value, endianness) {
		this.ensureCapacity(size);

		callback.call(this.view, this.offset, value, endianness);

		this.offset += size;
	}

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readInt8 = offset => this.read(DataView.prototype.getInt8, 1, null, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readUInt8 = offset => this.read(DataView.prototype.getUint8, 1, null, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readInt16LE = offset => this.read(DataView.prototype.getInt16, 2, true, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readInt16BE = offset => this.read(DataView.prototype.getInt16, 2, false, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readUInt16LE = offset => this.read(DataView.prototype.getUint16, 2, true, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readUInt16BE = offset => this.read(DataView.prototype.getUint16, 2, false, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readInt32LE = offset => this.read(DataView.prototype.getInt32, 4, true, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readInt32BE = offset => this.read(DataView.prototype.getInt32, 4, false, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readUInt32LE = offset => this.read(DataView.prototype.getUint32, 4, true, offset)

	/**
	 * @param {number} [offset]
	 * @returns {number}
	 */
	readUInt32BE = offset => this.read(DataView.prototype.getUint32, 4, false, offset)

	/** @returns {string} */
	readString16() {
		let result = '';

		for (;;) {
			const ch = !this.eof ? this.readUInt16LE() : 0;
			if (ch === 0) break;

			result += String.fromCharCode(ch);
		}

		return result;
	}

	/** @returns {string} */
	readString() {
		let result = '';

		for (;;) {
			const ch = !this.eof ? this.readUInt8() : 0;
			if (ch === 0) break;

			result += String.fromCharCode(ch);
		}

		return result;
	}

	/** @returns {string} */
	readEscapedString = () => decodeURIComponent(escape(this.readString()))

	/** @param {number} value */
	writeInt8 = value => this.write(DataView.prototype.setInt8, 1, value, null)

	/** @param {number} value */
	writeUInt8 = value => this.write(DataView.prototype.setUint8, 1, value, null);

	/** @param {number} value */
	writeInt16LE = value => this.write(DataView.prototype.setInt16, 2, value, true)

	/** @param {number} value */
	writeInt16BE = value => this.write(DataView.prototype.setInt16, 2, value, false)

	/** @param {number} value */
	writeUInt16LE = value => this.write(DataView.prototype.setUint16, 2, value, true)

	/** @param {number} value */
	writeUInt16BE = value => this.write(DataView.prototype.setUint16, 2, value, false)

	/** @param {number} value */
	writeInt32LE = value => this.write(DataView.prototype.setInt32, 4, value, true)

	/** @param {number} value */
	writeInt32BE = value => this.write(DataView.prototype.setInt32, 4, value, false)

	/** @param {number} value */
	writeUInt32LE = value => this.write(DataView.prototype.setUint32, 4, value, true)

	/** @param {number} value */
	writeUInt32BE = value => this.write(DataView.prototype.setUint32, 4, value, false)

	/** @param {string} value */
	writeString(value) {
		const l = value.length;
		this.ensureCapacity(l); /* optimization */
		for (let i = 0; i < l; i++) {
			this.writeUInt8(value.charCodeAt(i));
		}
	}

	/** @param {string} value */
	writeStringNT(value) {
		this.writeString(value);
		this.writeUInt8(0);
	}

	/** @param {string} value */
	writeEscapedString = value => this.writeString(unescape(encodeURIComponent(value)))

	/** @param {string} value */
	writeEscapedStringNT = value => this.writeStringNT(unescape(encodeURIComponent(value)))
};

window.SmartBuffer = SmartBuffer;

// end of import

(function(modules) {
	function webpackJsonpCallback(data) {
		const chunkIds = data[0],
			moreModules = data[1],
			executeModules = data[2];

		const resolves = [];

		for (const chunkId of chunkIds) {
			if (installedChunks[chunkId])
				resolves.push(installedChunks[chunkId][0]);

			installedChunks[chunkId] = 0;
		}

		for (const moduleId in moreModules) {
			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId))
				modules[moduleId] = moreModules[moduleId];
		}

		if (parentJsonpFunction)
			parentJsonpFunction(data);

		while (resolves.length)
			resolves.shift()();

		deferredModules.push.apply(deferredModules, executeModules || []);

		return checkDeferredModules();
	}

	function checkDeferredModules() {
		let result;

		for (let i = 0; i < deferredModules.length; i++) {
			const deferredModule = deferredModules[i];
			let fulfilled = true;

			for (let j = 1; j < deferredModule.length; j++) {
				const depId = deferredModule[j];

				if (installedChunks[depId] !== 0)
					fulfilled = false;
			}

			if (fulfilled) {
				deferredModules.splice(i--, 1);

				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
			}
		}

		return result;
	}

	const installedModules = {};
	const installedChunks = {
		/* runtime */
		0: 0
	};

	const deferredModules = [];

	function __webpack_require__(moduleId) {
		if (installedModules[moduleId])
			return installedModules[moduleId].exports;
		else {
			const module = installedModules[moduleId] = {
				i: moduleId,
				l: false,
				exports: {}
			};

			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

			module.l = true;

			return module.exports;
		}
	}

	__webpack_require__.m = window.modules = modules;

	__webpack_require__.c = installedModules;

	__webpack_require__.d = function(exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, {
				enumerable: true,
				get: getter
			});
		}
	};

	__webpack_require__.r = function(exports) {
		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, {
				value: 'Module'
			});
		}

		Object.defineProperty(exports, '__esModule', {
			value: true
		});
	};

	__webpack_require__.t = function(value, mode) {
		if (mode & 1)
			value = __webpack_require__(value);

		if (mode & 8)
			return value;
		else if ((mode & 4) && typeof value === 'object' && value && value.__esModule)
			return value;
		else {
			const ns = Object.create(null);

			__webpack_require__.r(ns);

			Object.defineProperty(ns, 'default', {
				enumerable: true,
				value: value
			});

			if (mode & 2 && typeof value != 'string') {
				for (const key in value) __webpack_require__.d(ns, key, function(key) {
					return value[key];
				}.bind(null, key));
			}

			return ns;
		}
	};

	__webpack_require__.n = function(module) {
		const getter = module && module.__esModule ?
			/* getDefault */
			() => module.default :
			/* getModuleExports */
			() => module;
		__webpack_require__.d(getter, 'a', getter);
		return getter;
	};

	__webpack_require__.o = (object, property) => Object.prototype.hasOwnProperty.call(object, property);

	__webpack_require__.p = '';

	let jsonpArray = window.webpackJsonp = window.webpackJsonp || [];
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);

	jsonpArray.push = webpackJsonpCallback;
	jsonpArray = jsonpArray.slice();

	for (const value of jsonpArray)
		webpackJsonpCallback(value);

	var parentJsonpFunction = oldJsonpFunction;

	deferredModules.push([118, 1]);
	checkDeferredModules();
})([, function(module, _, __webpack_require__) {
	const EventEmitter = __webpack_require__(23);
	const settings = __webpack_require__(4);
	const Renderer = __webpack_require__(24);
	const SkinWorker = __webpack_require__(128);
	const TextureManagers = __webpack_require__(12);
	const Scene = __webpack_require__(121);
	const PlayerManager = __webpack_require__(125);
	const {lerp, clamp, hideCaptchaBadge} = __webpack_require__(8);

	const gameObject = window.gameObject = new class Game {};
	gameObject.clientVersion = 19;
	gameObject.events = new EventEmitter();
	gameObject.settings = settings;
	gameObject.renderer = Renderer;
	gameObject.usingWebGL = Renderer.type === PIXI.RENDERER_TYPE.WEBGL;
	gameObject.skinLoader = new SkinWorker();

	const gameState = gameObject.state = {
		connectionUrl: null,
		selectedServer: null,
		interactible: false,
		spectators: 0,
		isAlive: false,
		playButtonDisabled: false,
		playButtonText: 'Play',
		deathDelay: false,
		isAutoRespawning: false
	};

	TextureManagers.virus.loadVirusFromUrl(settings.virusImageUrl);

	/** @param {MouseEvent} e */
	document.body.oncontextmenu = (e) => e.target?.id === 'email'

	gameObject.start = function(data) {
		if (!data.protocol || !data.instanceSeed || !data.playerId || !data.border) {
			throw 'Lacking mandatory data';
		}

		gameObject.running = true;

		gameObject.replaying = !!data.replayUpdates;
		gameObject.protocol = data.protocol;
		gameObject.modeId = data.gamemodeId || 0;
		gameObject.instanceSeed = data.instanceSeed;
		gameObject.pingstamp = 0;
		gameObject.timestamp = 0;
		gameObject.serverTick = 0;
		gameObject.playerId = data.playerId;
		gameObject.multiboxPid = null;
		gameObject.activePid = gameObject.playerId;
		gameObject.tagId = null;
		gameObject.spectating = false;
		gameState.spectators = 0;
		gameState.isAlive = false;
		gameObject.score = 0;
		gameObject.cellCount = 0;

		gameObject.nodes = {};
		gameObject.nodesOwn = {};
		gameObject.nodelist = [];
		gameObject.removedNodes = []

		gameObject.rawMouse = {}
		gameObject.mouse = {}

		const borderObject = gameObject.border = data.border;

		gameObject.food = data.food;

		gameObject.mouseZoom = 0.3;
		gameObject.mouseZoomMin = 0.01;

		gameObject.camera = {
			time: 0,
			sx: 0,
			sy: 0,
			ox: borderObject.x,
			nx: borderObject.x,
			oy: borderObject.y,
			ny: borderObject.y,
			oz: gameObject.mouseZoom,
			nz: gameObject.mouseZoom
		};

		gameObject.massTextPool = [];
		gameObject.crownPool = [];

		const showBackground = PIXI.utils.isWebGLSupported() && settings.useWebGL && settings.showBackgroundImage;

		const gameScene = gameObject.scene = new Scene(borderObject, showBackground);

		gameScene.container.pivot.set(borderObject.x, borderObject.y);
		gameScene.container.scale.set(gameObject.zoom);
		gameObject.playerManager = new PlayerManager(gameObject);
		gameObject.ticker = new PIXI.Ticker();
		gameObject.ticker.add(gameObject.tick);

		if (gameState.selectedServer && gameState.connectionUrl !== gameState.selectedServer.url) {
			gameState.selectedServer = null;
		}

		if (gameObject.replaying) {
			const updates = data.replayUpdates;
			gameObject.playback.set(updates);
			gameObject.moveInterval = setInterval(gameObject.playback.next.bind(gameObject.playback), 40);
			gameObject.events.$emit('show-replay-controls', updates.length);
			gameObject.events.$emit('minimap-stats-visible', false);
		} else {
			gameObject.splitCount = 0;
			gameObject.moveWaitUntil = 0;
			gameObject.stopMovePackets = false;
			gameObject.moveToCenterOfCells = false;
			gameObject.mouseFrozen = false;

			if (settings.minimapEnabled) {
				gameObject.events.$emit('minimap-show');
			}

			if (settings.showChat) {
				gameObject.events.$emit('chat-visible', {
					visible: true
				});
			}

			gameObject.events.$emit('leaderboard-show');
			gameObject.events.$emit('stats-visible', true);

			gameObject.moveInterval = setInterval(() => {
				if (gameObject.stopMovePackets) return;
				if (gameObject.moveToCenterOfCells) {
					gameObject.connection.sendOpcode(9);
					return;
				}
				gameObject.connection.sendMouse();
			}, 40);

			gameObject.events.$on('every-second', gameObject.everySecond);
			gameState.interactible = true;
			gameObject.lastDeathTime = Date.now();
		}

		gameObject.ticker.start();

		gameObject.eventListeners(true);

		gameObject.events.$emit('game-started');
	}

	/** @param {number?} elapsedTime */
	gameObject.updateStats = (elapsedTime) => {
		gameObject.events.$emit('stats-changed', {
			ping: elapsedTime,
			fps: Math.round(gameObject.ticker.FPS),
			mass: gameObject.score,
			score: gameObject.highscore
		});

		gameObject.events.$emit('minimap-stats-changed', {
			playerCount: gameObject.playerManager.playerCount,
			spectators: gameState.spectators
		});
	}

	gameObject.everySecond = function() {
		const {app:ui} = gameObject;
		if (false && (ui.showMenu || ui.showDeathScreen)) { /* anti afk */
			gameObject.updateStats(null);
		} else {
			gameObject.pingstamp = Date.now();
			gameObject.connection.sendOpcode(3);
		}
	};

	gameObject.clearNodes = function() {
		const {nodelist:nl, removedNodes:rn} = gameObject;
		while (nl.length) nl[0].destroy();
		while (rn.length) rn.pop().destroySprite();
	};

	/**
	 * @param {object[]} pool 
	 * @param {boolean} state 
	 */
	const destroyPool = (pool, state) => {
		while (pool.length) pool.pop().destroy(state);
	}

	gameObject.stop = function() {
		gameObject.running = false;

		gameState.isAlive = false;
		gameState.spectators = 0;
		gameState.interactible = false;
		gameState.playButtonDisabled = false;
		gameState.playButtonText = 'Play';

		gameObject.eventListeners(false);

		delete gameObject.running;
		delete gameObject.protocol;
		delete gameObject.modeId;
		delete gameObject.initialDataPacket;
		delete gameObject.instanceSeed;
		delete gameObject.pingstamp;
		delete gameObject.timestamp;
		delete gameObject.serverTick;
		delete gameObject.playerId;
		delete gameObject.multiboxPid;
		delete gameObject.activePid;
		delete gameObject.tagId;
		delete gameObject.spectating;
		delete gameObject.center;
		delete gameObject.score;
		delete gameObject.highscore;
		delete gameObject.cellCount;
		delete gameObject.replaying;

		gameObject.clearNodes();
		delete gameObject.nodes;
		delete gameObject.nodesOwn;
		delete gameObject.nodelist;
		delete gameObject.removedNodes;

		delete gameObject.rawMouse;
		delete gameObject.mouse;
		delete gameObject.border;
		delete gameObject.mouseZoom;
		delete gameObject.mouseZoomMin;
		delete gameObject.camera;

		gameObject.ticker.stop();
		delete gameObject.ticker;

		delete gameObject.splitCount;
		delete gameObject.moveWaitUntil;
		delete gameObject.stopMovePackets;
		delete gameObject.moveToCenterOfCells;
		delete gameObject.mouseFrozen;
		delete gameObject.lastDeathTime;
		delete gameObject.selectedPlayer;

		clearInterval(gameObject.moveInterval);
		delete gameObject.moveInterval;

		gameObject.playback.reset();

		gameObject.events.$off('every-second', gameObject.everySecond);

		gameObject.skinLoader.clearCallbacks();

		gameObject.events.$emit('minimap-stats-visible', true);
		gameObject.events.$emit('stats-visible', false);
		gameObject.events.$emit('chat-visible', {visible:false});
		gameObject.events.$emit('leaderboard-hide');
		gameObject.events.$emit('minimap-hide');
		gameObject.events.$emit('show-replay-controls', false);

		gameObject.events.$emit('minimap-destroy');

		gameObject.events.$emit('cells-changed', 0);

		gameObject.events.$emit('reset-cautions');

		gameObject.events.$emit('game-stopped');

		gameObject.playerManager.destroy();
		delete gameObject.playerManager;

		const {scene} = gameObject;
		if (scene) {
			scene.destroyBackgroundImage(false);
			scene.uninstallMassTextFont();
			scene.container?.destroy(true);
			delete gameObject.scene;
		}

		gameObject.renderer.clear();

		TextureManagers.cells.destroyCache();
		TextureManagers.squares.destroyCache();

		destroyPool(gameObject.massTextPool, true);
		destroyPool(gameObject.crownPool, false);
		delete gameObject.massTextPool;
		delete gameObject.crownPool;
	}

	/** 
	 * @param {boolean?} [state] 
	 * @returns {boolean}
	 **/
	gameObject.showMenu = (state) => {
		const {app:ui} = gameObject;
		state ??= !ui.showMenu;
		ui.showMenu = state;

		if (state) {
			gameObject.events.$emit('menu-opened');
			// ad bullshit
			// if (showAds) {
			//  setTimeout(() => ui.showMenu && loadMenuAds(), 1500)
			// }
		} else {
			const node = document.activeElement;
			if (node?.id !== 'chatbox-input') {
				gameObject.renderer.view.focus();
			}
			gameObject.stopMovePackets = false;
			hideCaptchaBadge();
		}

		return state;
	}

	gameObject.triggerDeathDelay = function() {
		clearTimeout(gameObject.deathTimeout);
		delete gameObject.deathTimeout;
		gameState.deathDelay = false;
		gameState.isAutoRespawning = false;
		gameObject.showMenu(false);
		gameObject.app.showDeathScreen = true;
		// gameObject.events.$emit('refresh-deathscreen-ad');
	}

	gameObject.triggerAutoRespawn = function() {
		gameState.deathDelay = false;
		gameState.isAutoRespawning = false;
		gameObject.actions.join();
	}

	gameObject.tick = function() {
		gameObject.timestamp = performance.now();

		if (gameObject.timestamp >= gameObject.moveWaitUntil) {
			gameObject.updateMouse();
			gameObject.splitCount = 0;
		}

		const {removedNodes:rn} = gameObject;
		let i = rn.length;
		while (i--) {
			const node = rn[i];
			if (!node.update()) continue;
			node.destroySprite();
			rn.splice(i, 1);
		}

		const {nodelist:nl} = gameObject;
		let count = 0;
		i = 0;
		const limit = nl.length;
		while (i < limit) {
			const node = nl[i++];
			node.update();
			if (node.pid === gameObject.playerId) count++;
		}

		if (gameObject.cellCount !== count) {
			gameObject.events.$emit('cells-changed', count);
		}

		gameObject.scene.sort();

		const mass = gameObject.updateCamera();
		if (!mass) {
			gameObject.score = 0;
			delete gameObject.highscore;
		} else {
			gameObject.score = mass;
			gameObject.highscore = Math.max(mass, gameObject.highscore || 0);
		}

		gameObject.renderer.render(gameObject.scene.container);
	}

	/**
	 * @param {boolean} [server]
	 * @returns {number}
	 */
	gameObject.updateCamera = function(server) {
		const {scene, camera} = gameObject;

		const timeElasped = gameObject.timestamp - camera.time;

		const movementSpeed = clamp(timeElasped / settings.cameraMoveDelay, 0, 1);
		const zoomSpeed = clamp(timeElasped / settings.cameraZoomDelay, 0, 1);

		// camera position
		const cx = scene.container.pivot.x = lerp(camera.ox, camera.nx, movementSpeed);
		const cy = scene.container.pivot.y = lerp(camera.oy, camera.ny, movementSpeed);

		const scale = lerp(camera.oz, camera.nz, zoomSpeed);
		scene.container.scale.set(scale);

		let zoomScale = gameObject.mouseZoom;

		// next frame position
		let x = 0, y = 0;

		let score = 0;

		if (gameObject.spectating) {
			const {sx, sy} = camera;
			x = sx;
			y = sy;
		} else {
			const {nodesOwn:ownedCells, nodes:cells} = gameObject;

			let radius = 0;

			for (const id in ownedCells) {
				const cell = cells[id];
				const mass = Math.round(Math.pow(cell.nSize / 10, 2));
				x += cell.nx * mass;
				y += cell.ny * mass;
				score += mass;
				radius += cell.nSize;
			}

			if (!!score) {
				x /= score;
				y /= score;

				if (settings.autoZoom) {
					zoomScale *= Math.pow(Math.min(64 / radius, 1), 0.27);
				}
			} else {
				x = camera.nx;
				y = camera.ny;

				/** @note Uncomment this to disallow zooming when the player is dead and isn't spectating */
				// zoomScale = camera.nz;
			}
		}

		if (!server) {
			return score;
		}

		camera.ox = cx;
		camera.oy = cy;
		camera.oz = scale;
		camera.nx = x;
		camera.ny = y;
		camera.nz = zoomScale;
		camera.time = gameObject.timestamp;
		return 0;
	}

	/** @param {boolean} [override] */
	gameObject.updateMouse = function(override = false) {
		if (gameObject.mouseFrozen && !e) return;
		const containerObject = gameObject.scene.container;
		const {rawMouse, mouse} = gameObject;
		mouse.x = clamp(containerObject.pivot.x + (rawMouse.x - window.innerWidth / 2) / containerObject.scale.x, -32768, 32767);
		mouse.y = clamp(containerObject.pivot.y + (rawMouse.y - window.innerHeight / 2) / containerObject.scale.y, -32768, 32767);
	}

	if (false) {
		/** @param {number} n */
		gameObject.seededRandom = (n) => {
			const r = Math.sin(n) * (10000 + gameObject.instanceSeed);
			return r - Math.floor(r);
		}
	} else {
		// Optimization

		/** @param {number} n */
		gameObject.seededRandom = (n) => (n = Math.sin(n) * (10000 + gameObject.instanceSeed), n - Math.floor(n));
	}

	gameObject.getThumbnail = function createThumbnail() {
		// size of the (to be) created thumbnail
		const width = 240, height = 135;

		const stage = gameObject.scene.container;

		const tempStage = new PIXI.Container();

		tempStage.pivot.x = stage.position.x;
		tempStage.pivot.y = stage.position.y;

		tempStage.position.x = width / 2;
		tempStage.position.y = height / 2;

		tempStage.scale.set(0.25);

		tempStage.addChild(stage);

		const {renderer} = gameObject;

		const texture = PIXI.RenderTexture.create(width, height);
		renderer.render(tempStage, texture);

		tempStage.removeChild(stage);

		const sample = renderer.plugins.extract.canvas(texture);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = '#' + settings.backgroundColor;
		ctx.fill();
		ctx.drawImage(sample, 0, 0, width, height);

		const url = canvas.toDataURL();
		tempStage.destroy(true);

		return url;
	}

	/** 
	 * @param {number?} id 
	 * @returns {boolean}
	 **/
	gameObject.setTagId = (id) => {
		if (!id) id = null;
		if (id === gameObject.tagId) return false;
		gameObject.tagId = id;
		return true;
	}

	/** 
	 * @param {number} n
	 * @returns {string}
	 **/
	gameObject.getMassText = (n) => {
		if (!settings.shortMass || n < 1000) return n.toFixed(0);
		return (n / 1000).toFixed(1) + 'k';
	}

	gameObject.shouldAutoRespawn = function() {
		return settings.autoRespawn && !gameObject.app.showMenu;
		// if (!settings.autoRespawn) return false;
		// if (gameObject.app.showMenu) return false;
		// const elapsed = Date.now() - gameObject.lastDeathTime;
		// return !(elapsed > 60000)
	}

	setInterval(() => gameObject.events.$emit('every-second'), 1000);
	setInterval(() => gameObject.events.$emit('every-minute'), 60000);

	/*gameObject.events.$on('every-minute', () => {
		if (gameObject.app.showMenu) loadMenuAds()
	});*/

	module.exports = gameObject;
}, , , function(e) {
	var t = {
		useWebGL: true,
		gameResolution: 1,
		smallTextThreshold: 40,
		autoZoom: false,
		rememeberEjecting: true,
		autoRespawn: false,
		mouseFreezeSoft: true,
		drawDelay: 120,
		cameraMoveDelay: 150,
		cameraZoomDelay: 150,
		cameraZoomSpeed: 10,
		replayDuration: 8,
		showReplaySaved: 2,
		showNames: 2,
		showMass: 2,
		showSkins: 1,
		showOwnName: true,
		showOwnMass: true,
		showOwnSkin: true,
		showCrown: true,
		foodVisible: true,
		eatAnimation: true,
		showHud: true,
		showLeaderboard: true,
		showServerName: false,
		showChat: true,
		showChatToast: false,
		minimapEnabled: true,
		minimapLocations: true,
		showFPS: true,
		showPing: true,
		showCellCount: true,
		showPlayerScore: false,
		showPlayerMass: true,
		showClock: false,
		showSessionTime: false,
		showPlayerCount: false,
		showSpectators: false,
		showRestartTiming: false,
		showAutorespawnIndicator: true,
		showBlockedMessageCount: true,
		filterChatMessages: true,
		clearChatMessages: true,
		backgroundColor: "101010",
		borderColor: "000000",
		foodColor: "ffffff",
		ejectedColor: "ffa500",
		cellNameOutlineColor: "000000",
		cursorImageUrl: null,
		backgroundImageUrl: "img/background.png",
		virusImageUrl: "img/virus.png",
		cellMassColor: "ffffff",
		cellMassOutlineColor: "000000",
		cellNameFont: "Hind Madurai",
		cellNameWeight: 1,
		cellNameOutline: 2,
		cellNameSmoothOutline: true,
		cellLongNameThreshold: 750,
		cellMassFont: "Ubuntu",
		cellMassWeight: 2,
		cellMassOutline: 2,
		cellMassTextSize: 0,
		cellMassSmoothOutline: true,
		shortMass: true,
		showBackgroundImage: true,
		backgroundImageRepeat: true,
		backgroundDefaultIfUnequal: true,
		backgroundImageOpacity: 0.6,
		useFoodColor: false,
		namesEnabled: true,
		skinsEnabled: true,
		massEnabled: true,
		showLocations: false,
		cellBorderSize: 1,
		autoHideReplayControls: false,
		minimapSize: 220,
		minimapFPS: 30,
		minimapSmoothing: 0.08
	};

	function s(e) {
		switch (e) {
			case 2:
				return "bold";
			case 0:
				return "thin";
			default:
				return "normal";
		}
	}

	function a(e, t) {
		var s;
		switch (e) {
			case 3:
				s = t / 5;
				break;
			case 1:
				s = t / 20;
				break;
			default:
				s = t / 10;
				break;
		}
		return Math.ceil(s)
	}
	e.exports = window.settings = new class {
		constructor() {
			this.getInternalSettings(), this.userDefinedSettings = this.loadUserDefinedSettings(), Object.assign(this, t, this.userDefinedSettings), this.set("skinsEnabled", true), this.set("namesEnabled", true), this.set("massEnabled", true), this.compileNameFontStyle(), this.compileMassFontStyle()
		} ["getInternalSettings"]() {
			this.cellSize = 512
		} ["compileNameFontStyle"]() {
			var e = {
				fontFamily: this.cellNameFont,
				fontSize: 80,
				fontWeight: s(this.cellNameWeight)
			};
			return this.cellNameOutline && (e.stroke = PIXI.utils.string2hex(this.cellNameOutlineColor), e.strokeThickness = a(this.cellNameOutline, e.fontSize), e.lineJoin = this.cellNameSmoothOutline ? "round" : "miter"), this.nameTextStyle = e
		} ["compileMassFontStyle"]() {
			var e = {
				fontFamily: this.cellMassFont,
				fontSize: 56 + this.cellMassTextSize * 20,
				fontWeight: s(this.cellMassWeight),
				lineJoin: "round",
				fill: PIXI.utils.string2hex(this.cellMassColor)
			};
			return this.cellMassOutline && (e.stroke = PIXI.utils.string2hex(this.cellMassOutlineColor), e.strokeThickness = a(this.cellMassOutline, e.fontSize), e.lineJoin = this.cellMassSmoothOutline ? "round" : "miter"), this.massTextStyle = e
		} ["loadUserDefinedSettings"]() {
			if (!localStorage.settings) return {};
			try {
				return JSON.parse(localStorage.settings)
			} catch (e) {
				return {}
			}
		} ["getDefault"](e) {
			return t[e]
		} ["set"](e, t) {
			if (this[e] === t) return false;
			return this[e] = t, this.userDefinedSettings[e] = t, localStorage.settings = JSON.stringify(this.userDefinedSettings), true
		}
	}
}, function(e, t, s) {
	var a = s(270)["default"],
		n = a.mixin({
			toast: true,
			position: "top",
			showConfirmButton: false,
			showCloseButton: true
		});
	window.Swal = a, e.exports = {
		toast: n,
		alert: function(e) {
			a.fire({
				text: e,
				confirmButtonText: "OK"
			})
		},
		confirm: function(e, t, s) {
			a.fire({
				text: e,
				showCancelButton: true,
				confirmButtonText: "Continue"
			}).then(e => {
				if (e.value) t();
				else {
					if (s) s()
				}
			})
		},
		instance: a
	}
}, , , function(e) {
	var t = false;

	function s() {
		if (t) return;
		document.body.classList.add("hide-captcha-badge"), t = true
	}
	e.exports = {
		/**
		 * Linearly interpolate between `x` and `v`, where alpha is `a`
		 * @param {number} a
		 * @param {number} b
		 * @param {number} amount
		 * @returns {number} The interpolated value
		 */
		lerp: (a, b, amount) => a + (b - a) * amount,
		// lerp: (a, b, amount) => (1 - amount) * a + amount * b,

		/**
		 * Clamps `value` between `min` and `max` inclusive
		 * @param {number} value
		 * @param {number} min
		 * @param {number} max
		 * @returns {number} The clamped value
		 */
		clamp: (value, min, max) => Math.min(max, Math.max(min, value)),

		createBuffer: function(e) {
			return new DataView(new ArrayBuffer(e))
		},
		encodeHTML: function(e) {
			return e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;"), e
		},
		getTimestamp: function() {
			var e = new Date,
				t = e.getMonth() + 1,
				s = e.getDate(),
				a = [e.getFullYear(), (t > 9 ? "" : "0") + t, (s > 9 ? "" : "0") + s].join(""),
				n = ("0" + e.getHours()).slice(-2),
				o = ("0" + e.getMinutes()).slice(-2),
				i = ("0" + e.getSeconds()).slice(-2),
				r = [n, o, i].join("");
			return a + "-" + r
		},
		loadImage: function(e) {
			return fetch(e, {
				mode: "cors"
			}).then(e => e.blob()).then(e => createImageBitmap(e))
		},
		hideCaptchaBadge: s,
		destroyPixiPlugins: function(e) {
			["interaction", "accessibility"].forEach(t => {
				var s = e.plugins[t];
				s && (s.destroy(), delete e.plugins[t])
			})
		},
		writePlayerData: function(e) {
			var t = document.getElementById("nickname").value,
				s = document.getElementById("skinurl").value,
				a = document.getElementById("teamtag").value;
			e.utf8(t), e.utf8(s), e.utf8(a)
		}
	}
}, , , , function(e, t, s) {
	var a = s(122),
		n = s(123),
		o = s(124);
	e.exports = {
		cells: a,
		squares: n,
		virus: o
	}
}, , function(e, t, s) {
	var a = s(1),
		n = s(12);
	e.exports = class {
		constructor(e) {
			this.game = a, this.id = e.id || 0, this.flags = e.flags, this.oSize = this.size = e.size, this.updateTime = 0, this.newPositionScale = 1, this.removed = false, this.texture = e.texture || n.cells.getTexture(0), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(0.5), this.sprite.gameData = this, this.x = this.ox = this.sprite.position.x = e.x, this.y = this.oy = this.sprite.position.y = e.y
		} ["update"]() {
			var e = (this.game.timestamp - this.updateTime) / this.game.settings.drawDelay;
			e = 0 > e ? 0 : 1 < e ? 1 : e, this.x = e * this.newPositionScale * (this.nx - this.ox) + this.ox, this.y = e * this.newPositionScale * (this.ny - this.oy) + this.oy;
			var t = 2 * (this.size = e * (this.nSize - this.oSize) + this.oSize),
				s = this.sprite.position.x !== this.x || this.sprite.position.y !== this.y || this.sprite.width !== t;
			if (this.texture.clearedFromCache || !s) return true;
			this.sprite.position.x = this.x, this.sprite.position.y = this.y, this.sprite.width = this.sprite.height = t, this.onUpdate && this.onUpdate()
		} ["destroy"](e) {
			if (this.removed) {
				console.warn("Cell already removed!");
				return
			}
			if (this.onDestroy) this.onDestroy();
			var t = this.game.nodelist,
				s = t.indexOf(this);
			if (s >= 0) t.splice(s, 1);
			delete this.game.nodes[this.id], delete this.game.nodesOwn[this.id], this.removed = true;
			if (e) this.game.removedNodes.push(this);
			else this.destroySprite()
		} ["destroySprite"]() {
			if (!this.sprite) {
				console.warn("Sprite already destroyed!");
				return
			}
			this.sprite.destroy(), this.sprite = null
		}
	}
}, , , function(e, t, a) {
	var n = a(5);

	function o() {
		return new Promise(e => {
			var t = new Image;
			t.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA", t.onload = t.onerror = () => {
				e(t.height === 2)
			}
		})
	}

	function i() {
		n.instance.fire({
			type: "warning",
			title: "Browser support limited",
			html: "Skins might not work properly in this browser.<br>Please consider using Chrome.",
			allowOutsideClick: false
		})
	}

	function d() {
		n.instance.fire({
			type: "warning",
			title: "Safari browser is not supported :(",
			html: "Please consider using Google Chrome.",
			allowOutsideClick: false,
			showCloseButton: false,
			showCancelButton: false,
			showConfirmButton: false
		})
	}

	function c(e) {
		for (var t = "", s = 0, a; s < e.length; s++) {
			a = e.charCodeAt(s) - 2;
			t += String.fromCharCode(a)
		}
		return t
	}
	var r = ["pkiigt", "p3iigt", "pkii5t", "pkiic", "p3iic", "p3ii6", "pkii", "p3ii", "p3i", "hciiqv", "h6iiqv", "hcii2v", "hci", "cpcn", "cuujqng", "ewpv", "rwuu{", "xcikpc", "xci3pc", "eqem", "e2em", "uewo", "ycpm", "yjqtg", "yj2tg", "unwv", "dkvej", "d3vej", "rqtp", "r2tp", "tcrg", "t6rg", "jkvngt", "j3vngt", "jkvn5t", "j3vn5t", "pc|k", "p6|k", "tgvctf", "ejkpm", "hwem", "ujkv"],
		p = r.map(c),
		s = r.map(c).sort((e, t) => t.length - e.length).map(e => new RegExp("[^\\s]*" + e.split("").join("\\s*") + "[^\\s]*", "gi"));
	e.exports = {
		noop: function() {},
		checkBadWords: function(e) {
			return e = e.toLowerCase(), p.some(t => e.includes(t))
		},
		replaceBadWordsChat: function(e) {
			for (var t = 0; t < s.length; t++) e = e.replace(s[t], e => Array(e.length).fill("*").join(""));
			return e
		},
		notifyUnsupportedBrowser: async function() {
			if (window.safari || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
				d();
				return
			}
			if (localStorage.skipUnsupportedAlert) return;
			localStorage.skipUnsupportedAlert = true;
			var e = await o();
			if (!e) i()
		},
		isFirstVisit: function() {
			if (localStorage.visitedBefore) return false;
			return localStorage.visitedBefore = true, true
		}()
	}
}, , , , , , , function(e, t, s) {
	var a = s(4),
		n = s(8);
	PIXI.utils.skipHello();
	var o = document.getElementById("canvas"),
		i = {
			resolution: a.customResolution || window.devicePixelRatio || 1,
			view: o,
			forceCanvas: !a.useWebGL,
			antialias: false,
			powerPreference: "high-performance",
			backgroundColor: PIXI.utils.string2hex(a.backgroundColor)
		};
	i.resolution = a.gameResolution;
	var r = PIXI.autoDetectRenderer(i);

	function l() {
		r.resize(window.innerWidth, window.innerHeight)
	}
	l(), n.destroyPixiPlugins(r), window.addEventListener("resize", l), r.clear(), e.exports = r
}, function(e) {
	function t() {
		this.data = []
	}
	e.exports = t, t.prototype.write = function() {
		return new Uint8Array(this.data)
	}, t.prototype.uint8 = function(e) {
		this.data.push(e)
	}, t.prototype.uint8Array = function(e) {
		for (var t = 0; t < e.length; t++) {
			this.data.push(e[t])
		}
	}, t.prototype.utf8 = function(e) {
		e = unescape(encodeURIComponent(e));
		for (var t = 0; t < e.length; t++) {
			this.data.push(e.charCodeAt(t))
		}
		this.data.push(0)
	}
}, , , , function(e, t, s) {
	var a = s(2),
		n = s(167);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	'use strict';
	var a = s(31),
		n = s.n(a);
	t["default"] = n.a
}, function(e) {
	e.exports = {
		"data"() {
			return {}
		}
	}
}, function(e, t, s) {
	var a = s(2),
		n = s(169);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(171);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(173);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(175);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(177);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(179);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	'use strict';
	var a = s(39),
		n = s.n(a);
	t["default"] = n.a
}, function(e, t, s) {
	var a = s(89),
		n = s(1),
		o = s(5),
		i = n.replay.database;
	e.exports = {
		props: ["replay"],
		methods: {
			async "play"(e) {
				if (n.connection.opened) {
					var t = await new Promise(e => {
						o.confirm("You will be disconnected", () => e(true), () => e(false))
					});
					if (!t) return
				}
				try {
					n.replay.play(e)
				} catch (e) {
					console.log(e);
					// n.stop(), o.alert("Replay data is corrupted!")
				}
			},
			"downloadReplay"(e) {
				o.instance.fire({
					input: "text",
					inputValue: e.name,
					showCancelButton: true,
					confirmButtonText: "Download",
					html: "Only Vanis.io can read replay files.<br>It consists of player positions and other game related data."
				}).then(t => {
					var s = t.value;
					if (s) {
						var n = new Blob([e.data], {
							type: "text/plain;charset=utf-8"
						});
						a.saveAs(n, s + ".vanis")
					}
				})
			},
			"deleteReplay"(e) {
				o.confirm("Are you sure that you want to delete this replay?", () => {
					i.removeItem(e, () => {
						n.events.$emit("replay-removed")
					})
				})
			}
		}
	}
}, function(e, t, s) {
	var a = s(2),
		n = s(219);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(221);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(223);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(225);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(227);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(231);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(233);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(235);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(237);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(239);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(241);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(243);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(245);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(247);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(249);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	'use strict';
	var a = s(56),
		n = s.n(a);
	t["default"] = n.a
}, function(e, t, a) {
	var n = a(1),
		o = a(8),
		i = a(4),
		c = i.minimapSize,
		p = i.minimapFPS,
		u = i.minimapSmoothing,
		m = new PIXI.Container,
		g = {};

	function v(e, t) {
		var s = new PIXI.Text(e, {
			strokeThickness: 4,
			lineJoin: "round",
			fontFamily: "Nunito",
			fill: t,
			fontSize: 12
		});
		return s.anchor.set(0.5), s.pivot.y = 15, s
	}

	function s(e) {
		var t = new PIXI.Graphics;
		return t.beginFill(e), t.drawCircle(0, 0, 5), t.endFill(), t
	}

	function l() {
		return new Date().toLocaleTimeString()
	}

	function d(e, t = false) {
		if (t && e < 1) return "instant";
		e = Math.floor(e);
		const s = Math.floor(e / 60),
			a = Math.floor(s / 60);
		if (s < 1) return t ? e + "s" : "<1min";
		if (a < 1) return s + "min";
		if (s % 60 === 0) return a + "hr";
		return a + "hr " + s % 60 + "min"
	}
	e.exports = {
		"data"() {
			return {
				showMinimap: false,
				showMinimapCircle: false,
				showMinimapStats: true,
				showLocations: i.minimapLocations,
				interval: null,
				minimapStatsBottom: 10,
				showClock: i.showClock,
				showSessionTime: i.showSessionTime,
				showSpectators: i.showSpectators,
				showPlayerCount: i.showPlayerCount,
				showRestartTiming: i.showRestartTiming,
				systemTime: l(),
				sessionTime: d(0, false),
				restartTime: d(0, true),
				spectators: 0,
				playerCount: 0,
				restartTick: 0,
				startTime: null,
				gameState: n.state
			}
		},
		computed: {
			"playerCountDisplayed"() {
				if (this.gameState.selectedServer) {
					var e = this.gameState.selectedServer.slots;
					return Math.min(this.playerCount, e) + " / " + e + " players"
				}
				return this.playerCount + " player" + (this.playerCount === 1 ? "" : "s")
			}
		},
		methods: {
			"initRenderer"(e) {
				var t = PIXI.autoDetectRenderer({
					resolution: 1,
					view: e,
					width: c,
					height: c,
					forceCanvas: !i.useWebGL,
					antialias: false,
					powerPreference: "high-performance",
					transparent: true
				});
				t.clear(), this.renderer = t
			},
			"destroyMinimap"() {
				m.destroy(true), m = new PIXI.Container, this.renderer.clear()
			},
			"onMinimapShow"() {
				if (this.interval) return;
				this.showMinimap = true, this.minimapStatsBottom = c + 10, n.events.$on("minimap-positions", this.updatePositions), this.interval = setInterval(this.render, 1000 / p)
			},
			"onMinimapHide"() {
				if (!this.interval) return;
				this.showMinimap = false, this.minimapStatsBottom = 10, n.events.$off("minimap-positions", this.updatePositions), clearInterval(this.interval), this.interval = null, this.spectators = 0, this.playerCount = 0
			},
			"createNode"(e, t, a, n) {
				var o = g[e];
				if (o) o.destroy(true);
				if (!a) a = 16777215;
				if (!n) n = 16777215;
				var i = new PIXI.Container;
				i.newPosition = {}, i.addChild(s(n));
				if (t) i.addChild(v(t, a));
				g[e] = i
			},
			"destroyNode"(e) {
				var t = g[e];
				if (!t) return;
				t.destroy(true), delete g[e]
			},
			"updatePositions"(e) {
				m.removeChildren();
				for (var t = 0; t < e.length; t++) {
					var s = e[t],
						a = g[s.pid];
					if (!a) continue;
					a.newPosition.x = s.x * c, a.newPosition.y = s.y * c, m.addChild(a)
				}
				this.render()
			},
			"render"() {
				for (var e = m.children, t = u * (30 / p), s = 0, a; s < e.length; s++) {
					a = e[s];
					a.position.x = o.lerp(a.position.x, a.newPosition.x, t), a.position.y = o.lerp(a.position.y, a.newPosition.y, t)
				}
				this.renderer.render(m)
			},
			"drawLocationGrid"(e, t) {
				e.globalAlpha = 0.1, e.strokeStyle = "#202020", e.beginPath();
				for (var s = 1, a; s < t; s++) {
					a = s * (c / t);
					e.moveTo(a, 0), e.lineTo(a, c), e.moveTo(0, a), e.lineTo(c, a)
				}
				e.stroke(), e.closePath()
			},
			"drawLocationCodes"(e, s) {
				var a = c / s,
					n = a / 2;
				e.globalAlpha = 0.1, e.font = "14px Nunito", e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = "#ffffff";
				for (var o = 0, i; o < s; o++) {
					i = o * a + n;
					for (var r = 0; r < s; r++) {
						var l = String.fromCharCode(97 + r).toUpperCase() + (o + 1),
							d = r * a + n;
						e.strokeText(l, i, d), e.fillText(l, i, d)
					}
				}
			},
			"drawLocations"(e) {
				e.width = e.height = c;
				var t = e.getContext("2d"),
					s = c / 2;
				if (this.showLocations) {
					t.save();
					if (this.showMinimapCircle) {
						var a = new Path2D;
						a.ellipse(s, s, s, s, 0, 0, 2 * Math.PI), t.clip(a)
					}
					this.drawLocationGrid(t, 5), this.drawLocationCodes(t, 5)
				}
				t.restore(), this.showMinimapCircle && (t.globalAlpha = 0.45, t.beginPath(), t.arc(s, s, s + 1, -Math.PI / 2, 0), t.lineTo(c, 0), t.closePath(), t.fill())
			}
		},
		"created"() {
			n.events.$on("minimap-show", this.onMinimapShow), n.events.$on("minimap-hide", this.onMinimapHide), n.events.$on("minimap-destroy", this.destroyMinimap), n.events.$on("minimap-create-node", this.createNode), n.events.$on("minimap-destroy-node", this.destroyNode), n.events.$on("minimap-show-locations", e => {
				this.showLocations = e, this.drawLocations(this.$refs.locations)
			}), n.events.$on("minimap-stats-visible", e => this.showMinimapStats = e), n.events.$on("minimap-stats-changed", e => {
				this.spectators = e.spectators, this.playerCount = e.playerCount
			}), n.events.$on("restart-timing-changed", e => this.restartTick = e), n.events.$on("game-started", () => {
				this.showMinimapCircle = n.border.circle, this.drawLocations(this.$refs.locations)
			}), n.events.$on("game-stopped", () => this.restartTick = 0), n.events.$on("minimap-stats-invalidate-shown", () => {
				this.showClock = i.showClock, this.showSessionTime = i.showSessionTime, this.showSpectators = i.showSpectators, this.showPlayerCount = i.showPlayerCount, this.showRestartTiming = i.showRestartTiming
			}), n.events.$on("every-second", () => {
				this.systemTime = l();
				var e = (Date.now() - this.startTime) / 1000;
				this.sessionTime = d(e, false);
				if (this.restartTick && n.serverTick) e = (this.restartTick - n.serverTick) / 25, this.restartTime = d(e, true);
				else this.restartTime = null
			})
		},
		"mounted"() {
			this.initRenderer(this.$refs.minimap), this.startTime = Date.now()
		}
	}
}, function(e, t, s) {
	var a = s(2),
		n = s(251);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(253);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(255);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(257);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(259);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(261);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(263);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function(e, t, s) {
	var a = s(2),
		n = s(266);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, , function(e, t, s) {
	var a = s(1),
		n = s(5),
		o = {
			toggleAutoRespawn: function() {
				var e = a.settings.autoRespawn;
				a.settings.set("autoRespawn", !e);
				if (e && a.state.isAutoRespawning) a.triggerDeathDelay(true);
				var t = "Auto respawn ";
				t += e ? "disabled" : "enabled", n.toast.fire({
					type: "info",
					title: t,
					timer: 1500
				})
			},
			respawn: function() {
				if (a.state.deathDelay || a.state.playButtonDisabled) return;
				a.actions.join(), a.showMenu(false)
			},
			feed: a.actions.feed.bind(null),
			feedMacro: a.actions.feed.bind(null, true),
			split: a.actions.split.bind(null, 1),
			splitx2: a.actions.split.bind(null, 2, a.settings.delayDoublesplit ? 40 : 0),
			splitx3: a.actions.split.bind(null, 3),
			splitMax: a.actions.split.bind(null, 4),
			split32: a.actions.split.bind(null, 5),
			split64: a.actions.split.bind(null, 6),
			split128: a.actions.split.bind(null, 7),
			split256: a.actions.split.bind(null, 8),
			linesplit: a.actions.linesplit,
			freezeMouse: a.actions.freezeMouse,
			lockLinesplit: a.actions.lockLinesplit,
			stopMovement: a.actions.stopMovement,
			toggleSkins: a.actions.toggleSkins,
			toggleNames: a.actions.toggleNames,
			toggleFood: a.actions.toggleFood,
			toggleMass: a.actions.toggleMass,
			toggleChat: a.actions.toggleChat,
			toggleChatToast: a.actions.toggleChatToast,
			toggleHud: a.actions.toggleHud,
			spectateLock: a.actions.spectateLockToggle,
			spectatePlayer: a.actions.spectatePlayer,
			selectPlayer: a.actions.selectPlayer,
			saveReplay: a.replay.save,
			zoomLevel1: a.actions.setZoomLevel.bind(null, 1),
			zoomLevel2: a.actions.setZoomLevel.bind(null, 2),
			zoomLevel3: a.actions.setZoomLevel.bind(null, 3),
			zoomLevel4: a.actions.setZoomLevel.bind(null, 4),
			zoomLevel5: a.actions.setZoomLevel.bind(null, 5),
			switchMultibox: a.actions.switchMultibox
		},
		i = {
			feed: "W",
			feedMacro: "MOUSE0",
			split: "SPACE",
			splitx2: "G",
			splitx3: "H",
			splitMax: "T",
			split32: "",
			split64: "",
			linesplit: "Z",
			lockLinesplit: "",
			respawn: "",
			toggleAutoRespawn: "",
			stopMovement: "",
			toggleSkins: "",
			toggleNames: "",
			toggleMass: "",
			spectateLock: "Q",
			selectPlayer: "MOUSE1",
			saveReplay: "R",
			toggleChat: "",
			toggleChatToast: "",
			toggleHud: "",
			zoomLevel1: "1",
			zoomLevel2: "2",
			zoomLevel3: "3",
			zoomLevel4: "4",
			zoomLevel5: "5",
			switchMultibox: ""
		};
	e.exports = new class {
		constructor() {
			this.version = 2, this.pressHandlers = null, this.releaseHandlers = null, this.resetObsoleteHotkeys(), this.load()
		} ["resetObsoleteHotkeys"]() {
			if (parseInt(localStorage.hotkeysVersion) === this.version) return;
			if (localStorage.hotkeys) localStorage.removeItem("hotkeys");
			localStorage.hotkeysVersion = this.version
		} ["load"]() {
			this.hotkeys = this.loadHotkeys(), this.loadHandlers(this.hotkeys)
		} ["loadHotkeys"]() {
			var e = Object.assign({}, i),
				t = localStorage.hotkeys;
			if (!t) return e;
			t = JSON.parse(t);
			var a = Object.values(t);
			return Object.keys(e).forEach(t => {
				var s = e[t];
				if (s && a.includes(s)) e[t] = ""
			}), Object.assign(e, t)
		} ["saveHotkeys"](e) {
			localStorage.hotkeys = JSON.stringify(e)
		} ["reset"]() {
			return localStorage.removeItem("hotkeys"), this.load(), this.hotkeys
		} ["get"]() {
			return this.hotkeys
		} ["set"](e, t) {
			var a = o[e];
			if (!a) return;
			if (this.hotkeys[e] === t) return true;
			if (t)
				for (var n in this.hotkeys) {
					var s = this.hotkeys[n];
					if (s === t) this.hotkeys[n] = ""
				}
			return this.hotkeys[e] = t, this.saveHotkeys(this.hotkeys), this.loadHandlers(this.hotkeys), true
		} ["loadHandlers"](e) {
			this.pressHandlers = {}, Object.keys(e).forEach(t => {
				var a = o[t];
				if (!a) {
					console.warn("Invalid action in hotkeys", t);
					return
				}
				var n = e[t];
				this.pressHandlers[n] = a
			}), this.releaseHandlers = {};
			if (e.feedMacro) this.releaseHandlers[e.feedMacro] = a.actions.feed.bind(null, false)
		} ["press"](e) {
			var t = this.pressHandlers[e];
			return t ? (t(), true) : false
		} ["release"](e) {
			var t = this.releaseHandlers[e];
			t && t()
		} ["convertKey"](e) {
			if (!e) return "Unknown";
			return e.toString().toUpperCase().replace(/^(LEFT|RIGHT|NUMPAD|DIGIT|KEY)/, "")
		}
	}
}, , , , , , , function(e, t, s) {
	'use strict';
	var a = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: 'minimap-wrapper'
			}, [s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showMinimapStats,
					expression: "showMinimapStats"
				}],
				staticClass: "minimap-stats",
				style: {
					bottom: e.minimapStatsBottom + "px"
				}
			}, [s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showClock,
					expression: "showClock"
				}]
			}, [e._v(e._s(e.systemTime))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showSessionTime,
					expression: "showSessionTime"
				}]
			}, [e._v(e._s(e.sessionTime) + " session")]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showPlayerCount && e.playerCount,
					expression: "showPlayerCount && playerCount"
				}]
			}, [e._v(e._s(e.playerCountDisplayed))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showSpectators && e.spectators,
					expression: "showSpectators && spectators"
				}]
			}, [e._v(e._s(e.spectators) + " spectator" + e._s(e.spectators === 1 ? "" : "s"))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showRestartTiming && e.restartTime,
					expression: "showRestartTiming && restartTime"
				}]
			}, [e._v("Restart in " + e._s(e.restartTime))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.gameState.isAutoRespawning,
					expression: "gameState.isAutoRespawning"
				}]
			}, [e._v("Auto respawning")])]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showMinimap,
					expression: "showMinimap"
				}],
				staticClass: "container",
				class: {
					circle: e.showMinimapCircle
				}
			}, [s("canvas", {
				ref: "locations",
				attrs: {
					id: "locations"
				}
			}), e._v(" "), s("canvas", {
				ref: "minimap",
				attrs: {
					id: "minimap"
				}
			})])])
		},
		n = [];
	a._withStripped = true, s.d(t, "a", function() {
		return a
	}), s.d(t, "b", function() {
		return n
	})
}, function(e, t, s) {
	'use strict';
	var a = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("transition", {
				attrs: {
					name: "fade",
					appear: ""
				}
			}, [s("div", {
				staticClass: "modal"
			}, [s("div", {
				staticClass: "overlay",
				on: {
					click: function() {
						return e.$emit("close")
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "fas fa-times-circle close-button",
				on: {
					click: function() {
						return e.$emit("close")
					}
				}
			}), e._v(" "), s("div", {
				staticClass: "wrapper"
			}, [s("transition", {
				attrs: {
					name: "scale",
					appear: ""
				}
			}, [s("div", {
				staticClass: "content fade-box"
			}, [e._t("default", [e._v("Here should be something")])], 2)])], 1)])])
		},
		n = [];
	a._withStripped = true, s.d(t, "a", function() {
		return a
	}), s.d(t, "b", function() {
		return n
	})
}, function(e, t, s) {
	'use strict';
	var a = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "replay-item",
				style: {
					backgroundImage: "url('" + e.replay.image + "')"
				},
				on: {
					click: function() {
						return e.play(e.replay.data)
					}
				}
			}, [s("div", {
				staticClass: "replay-header",
				on: {
					click: function(e) {
						e.stopPropagation()
					}
				}
			}, [s("div", {
				staticClass: "replay-name"
			}, [e._v(e._s(e.replay.name))]), e._v(" "), s("div", [s("i", {
				staticClass: "replay-button fas fa-cloud-download-alt",
				on: {
					click: function(t) {
						return t.stopPropagation(), e.downloadReplay(e.replay)
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "replay-button fas fa-trash-alt",
				on: {
					click: function(t) {
						return t.stopPropagation(), e.deleteReplay(e.replay.name)
					}
				}
			})])])])
		},
		n = [];
	a._withStripped = true, s.d(t, "a", function() {
		return a
	}), s.d(t, "b", function() {
		return n
	})
}, function(e, t) {
	t.neon = [16776960, 65280, 65535, 16711935], t.basic = [16711680, 16744448, 16776960, 8453888, 65280, 65408, 65535, 33023, 8388863, 16711935, 16711808], t.basicd = t.basic.map(e => {
		var t = e >> 16 & 255,
			s = e >> 8 & 255,
			a = e & 255,
			n = 0.5;
		return t *= n, s *= n, a *= n, t << 16 | s << 8 | a >> 0
	})
}, function(e) {
	var t = new class {
		constructor() {
			this.ads = {}
		} ["addAd"](e, t, s) {
			this.ads[e] = {
				elementId: t,
				lastRefresh: 0,
				waitInterval: s || 0
			}
		} ["getAd"](e) {
			var t = this.ads[e];
			if (t) return t;
			return console.warn("Ad with alias " + e + " not found!"), null
		} ["pushAd"](e) {
			aiptag.cmd.display.push(function() {
				aipDisplayTag.display(e)
			})
		} ["refreshAd"](e) {
			var t = this.getAd(e);
			if (!t) return false;
			var s = Date.now(),
				a = t.lastRefresh + t.waitInterval * 1000 > s;
			if (a) return false;
			t.lastRefresh = s;
			this.pushAd(t.elementId);
			return true
		}
	};
	t.addAd("menu-box", "vanis-io_300x250", 30), t.addAd("menu-banner", "vanis-io_728x90", 120), t.addAd("death-box", "vanis-io_300x250_2", 30), e.exports = {
		"loadAdinplay"(e) {
			var t = window.aiptag = t || {};
			t.cmd = t.cmd || [], t.cmd.display = t.cmd.display || [], t.gdprShowConsentTool = true;
			var s = document.createElement("script");
			s.onload = e, s.src = "//api.adinplay.com/libs/aiptag/pub/VAN/vanis.io/tag.min.js", document.head.appendChild(s)
		},
		"refreshAd"(e) {
			return t.refreshAd(e)
		},
		"loadMenuAds"() {
			t.refreshAd("menu-box"), t.refreshAd("menu-banner")
		}
	}
}, function(module) {
	/** 
	 * @param {SmartBuffer} buffer
	 * @returns {object}
	 **/
	const parse = (buffer) => {
		const data = {
			border: {},
			food: {}
		};

		data.protocol = buffer.readUInt8();

		if (data.protocol >= 4) {
			data.gamemodeId = buffer.readUInt8();
			data.instanceSeed = buffer.readUInt16LE();
			data.playerId = buffer.readUInt16LE();
			data.border.minx = buffer.readInt16LE();
			data.border.miny = buffer.readInt16LE();
			data.border.maxx = buffer.readInt16LE();
			data.border.maxy = buffer.readInt16LE();
			data.flags = buffer.readUInt8();
			data.border.circle = !!(data.flags & 1);

			const {food} = data;

			if (data.flags & 2) {
				const min = food.minSize = buffer.readUInt16LE();
				const max = food.maxSize = buffer.readUInt16LE();
				food.stepSize = (max - min);
			}

			if (data.flags & 4) {
				food.ejectedSize = buffer.readUInt16LE();
			}

			data.border.width = data.border.maxx - data.border.minx;
			data.border.height = data.border.maxy - data.border.miny;
		} else {
			if (data.protocol >= 2) {
				data.gamemodeId = buffer.readUInt8();
				data.instanceSeed = buffer.readUInt16LE();
				data.playerId = buffer.readUInt16LE();
				data.border.width = buffer.readUInt32LE();
				data.border.height = buffer.readUInt32LE();
			} else {
				data.gamemodeId = 1;
				data.instanceSeed = buffer.readInt16LE();
				data.playerId = buffer.readInt16LE();

				const d = buffer.readUInt16LE();
				data.border.width = d;
				data.border.height = d;
			}

			data.border.minx = -data.border.width / 2;
			data.border.miny = -data.border.height / 2;
			data.border.maxx = +data.border.width / 2;
			data.border.maxy = +data.border.height / 2;
		}

		data.border.x = (data.border.minx + data.border.maxx) / 2;
		data.border.y = (data.border.miny + data.border.maxy) / 2;
		return data;
	};

	module.exports = parse;
}, function(module, _, __webpack_require__) {
	// wasm imports

	const gameObject = __webpack_require__(1);
	const settings = __webpack_require__(4);
	const {PlayerCell, Virus, EjectedMass, Food, Crown, DeadCell} = __webpack_require__(133);

	/** @typedef {{type:number;id:number;pid:number?;x:number;y:number;size:number;flags:number?}} CellData */

	/**
	 * Adds a new cell or updates existing entry, keeping order of packets.
	 * @param {CellData} data 
	 * @param {number} tick
	 */
	const addOrUpdate = (data, tick) => {
		const type = data.type & 0x0f;
		const {id} = data;

		if ((data.x == null || data.size == null) && (type == 3 || type == 4)) {
			const {food} = gameObject;
			const s = data.size = ((type == 3) ? food.ejectedSize || 1 : food.minSize + id % food.stepSize || 1);

			if (type == 4) {
				const {border} = gameObject;
				data.x = border.minx + s + (border.width-2 * s) * gameObject.seededRandom(65536 + id);
				data.y = border.miny + s + (border.height-2 * s) * gameObject.seededRandom(131072 + id);
			}
		}
		
		const {nodes} = gameObject;

		let node = (id in nodes) ? nodes[id] : null;

		if (node) {
			node.update();
			node.ox = node.x;
			node.oy = node.y;
			node.oSize = node.size;
		} else {
			switch (type) {
				case 1: {
					const playerObj = gameObject.playerManager.getPlayer(data.pid);
					data.texture = playerObj.texture;
					node = new PlayerCell(data, playerObj);
					break;
				}

				case 2: {
					node = new Virus(data);
					break;
				}

				case 3: {
					node = new EjectedMass(data);
					break;
				}

				case 4: {
					node = new Food(data);
					break;
				}

				case 6: {
					node = new Crown(data);
					break;
				}

				default: {
					let color=0x404040, square=false;
					
					const flags = data.flags;
					if (flags > 1) {
						color = 0;

						if (flags & 0x80) {
							color |= 0x700000;
						}

						if (flags & 0x40) {
							color |= 0x7000;
						}

						if (flags & 0x20) {
							color |= 0x70;
						}

						if (flags & 0x10) {
							square = true;
						}
					}

					node = new DeadCell(data, color, square);
					break;
				}
			}

			const {scene} = gameObject;
			scene[(type & 3) ? 'addCell' : 'addFood'](node.sprite);

			node.createTick = tick;

			const {nodelist} = gameObject;
			nodelist.push(node);
			nodes[id] = node;
		}

		const {x, y} = data;
		if (x != null) {
			node.nx = x;
			node.ny = y;
		}

		const {size} = data;
		if (size != null) {
			node.nSize = size;
		}

		node.updateTime = gameObject.timestamp;

		const {player:playerObj} = node;
		if (!playerObj) return;

		if (playerObj.isMe) {
			gameObject.isAlive = true;
			gameObject.nodesOwn[id] = true;
		}

		const {replay:ReplayManager} = gameObject;
		if (ReplayManager.updateHistory.length) {
			playerObj.lastUpdateTick = tick;
		} else {
			delete playerObj.lastUpdateTick;
		}
	}

	/**
	 * @param {number} pid 
	 * @param {number} [aid] 
	 * @returns {void}
	 */
	const remove = (pid, aid) => {
		const {nodes} = gameObject;
		const prey = nodes[pid];
		if (!prey) return;
		const attacker = nodes[aid];
		if (!attacker) return void prey.destroy();
		prey.update();
		prey.destroy(settings.eatAnimation);
		prey.nx = attacker.x;
		prey.ny = attacker.y;
		const s = prey.nSize;
		prey.nSize = 0;
		prey.newPositionScale = 0;
		prey.updateTime = gameObject.timestamp;
	}

	/**
	 * 
	 * @param {SmartBuffer} buffer 
	 * @param {number} orderId
	 */
	const parse = (buffer, orderId) => {
		for (;;) {
			const indicies = buffer.readUInt8(); /* type|flags */
			if (indicies == 0) break;

			const type = indicies & 0x0f;

			const pid = ((indicies & 0x1f) == 1) ? buffer.readUInt16BE() : null;

			const id = buffer.readUInt16BE();

			const positionChanged = !(indicies & 0x20);
			let x=null, y=null;

			if (positionChanged) {
				x = buffer.readInt16BE();
				y = buffer.readInt16BE();
			}

			const size = !(indicies & 0x40) ? buffer.readUInt16BE() : 0;

			const data = {
				type: indicies, /* pass raw indicies as 'type' */
				pid,
				id,
				x, y,
				size,
				flags: +(type == 4)
			};

			if ((indicies<<24>>24) < 0) {
				const flags = buffer.readUInt8();
				data.flags = (flags | (data.flags | +(flags > 0x0f)));
			}

			addOrUpdate(data, orderId);
		}

		const {nodes} = gameObject;

		let count = buffer.readUInt16BE();

		while (count--) {
			const id = buffer.readUInt16BE();
			if (!(id in nodes)) continue;
			nodes[id].destroy();
		}

		count = buffer.readUInt16BE();

		while (count--) {
			const prey = buffer.readUInt16BE();
			const attacker = buffer.readUInt16BE();
			if (!(prey in nodes)) continue;
			remove(prey, attacker);
		}
	}

	gameObject.parseNodes = parse;

	module.exports = { addOrUpdate, remove };
}, function(e, t, s) {
	// wasm exports
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
	'use strict';
	var a = s(74),
		n = s(30),
		o = s(168),
		i = s(0),
		r = Object(i.a)(n["default"], a.a, a.b, false, null, "0eaeaf66", null);
	r.options.__file = "src/components/modal.vue", t["default"] = r.exports
}, function(e, t, s) {
	'use strict';
	var a = s(75),
		n = s(38),
		o = s(218),
		i = s(0),
		r = Object(i.a)(n["default"], a.a, a.b, false, null, "1dbc6ed9", null);
	r.options.__file = "src/components/replay-item.vue", t["default"] = r.exports
}, function(e, t, s) {
	'use strict';
	var a = s(73),
		n = s(55),
		o = s(250),
		i = s(0),
		r = Object(i.a)(n["default"], a.a, a.b, false, null, "4c95bd45", null);
	r.options.__file = "src/components/minimap.vue", t["default"] = r.exports
}, function(e, t, s) {
	'use strict';
	s.r(t);
	var a = s(8),
		n = s.n(a),
		o = s(119),
		i = s.n(o);
	window.v = 4, s(17).notifyUnsupportedBrowser(), s(1), s(130), s(132), s(142), s(164), s(269), s(267), s(268)
}, function(e, t, s) {
	var a = s(2),
		n = s(120);
	n = n.__esModule ? n["default"] : n;
	typeof n === "string" && (n = [
		[e.i, n, ""]
	]);
	var o = a(n, {
			insert: "head",
			singleton: false
		}),
		i = n.locals ? n.locals : {};
	e.exports = i
}, function() {}, function(module, _, __webpack_require__) {
	const settings = __webpack_require__(4);
	const TextureManagers = __webpack_require__(12);

	const createBorder = ({width, height, circle}) => {
		const c = PIXI.utils.string2hex(settings.borderColor);

		const g = new PIXI.Graphics();

		g.lineStyle(100, c, 1, 0.5);

		if (circle) {
			g.drawEllipse(width / 2, height / 2, width / 2, height / 2);
		} else {
			g.drawRect(0, 0, width, height);
		}

		g.endFill();

		g.pivot.set(width / 2, height / 2);

		return g;
	}

	const createBackground = ({width, height}) => {
		const g = new PIXI.Graphics()
			.beginFill(0xffffff)
			.drawEllipse(width / 2, height / 2, width / 2, height / 2)
			.endFill();

		g.pivot.set(width / 2, height / 2);

		return g;
	}

	/** @type {Game?} */
	let gameObject = null;

	class Scene {
		/**
		 * @param {{x:number;y:number}} borderObject 
		 * @param {boolean} showBackground 
		 */
		constructor(borderObject, showBackground) {
			if (gameObject === null) {
				gameObject = __webpack_require__(1);
			}

			this.border = borderObject;

			this.container = new PIXI.Container();
			this.background = new PIXI.Container();

			this.borderSprite = createBorder(borderObject);
			this.background.addChild(this.borderSprite);

			this.foreground = new PIXI.Container();

			this.food = new PIXI.Container();
			this.food.visible = settings.foodVisible;

			this.resetMassTextStyle(false);

			this.container.addChild(this.background, this.food, this.foreground);

			this.setPosition();

			if (showBackground) {
				this.setBackgroundImage();
			}

			this.background.position.x = borderObject.x;
			this.background.position.y = borderObject.y;
		}

		setPosition() {
			this.container.position.x = window.innerWidth / 2;
			this.container.position.y = window.innerHeight / 2;
		}

		sort() {
			this.foreground.children.sort((a, b) => (a = a.gameData).size === (b = b.gameData).size ? a.id - b.id : a.size - b.size);
		}

		/** @param {Cell} o */
		addCell(o) {
			this.foreground.addChild(o);
		}

		/** @param {Food} o */
		addFood(o) {
			this.food.addChild(o);
		}

		/** @param {boolean} state */
		toggleBackgroundImage(state) {
			if (state && !this.backgroundSprite) {
				this.setBackgroundImage();
			} else if (!state) {
				this.destroyBackgroundImage(true);
			}
		}

		setBackgroundImage() {
			const url = settings.backgroundImageUrl;

			if (!url) {
				this.destroyBackgroundImage();
				return;
			}

			const image = (settings.backgroundImageRepeat ?
				PIXI.TilingSprite : PIXI.Sprite).from(url, {});

			image.width = this.border.width;
			image.height = this.border.height;
			image.alpha = settings.backgroundImageOpacity;
			image.anchor.set(0.5);

			const sprite = this.backgroundSprite;

			if (sprite) {
				const full = image.texture !== sprite.texture;
				this.destroyBackgroundImage(full);
			}

			this.backgroundSprite = image;
			this.background.addChildAt(image, 0);

			if (!this.border.circle) return;

			const backgroundGraphic = createBackground(this.border);

			this.background.addChildAt(backgroundGraphic, 1);
			this.backgroundSprite.mask = backgroundGraphic;
		}

		/** @param {boolean?} [state] */
		destroyBackgroundImage(state) {
			if (!this.backgroundSprite) return;
			this.backgroundSprite.destroy(!!state);
			delete this.backgroundSprite;
		}

		resetBorder() {
			this.borderSprite.destroy();
			this.borderSprite = createBorder(this.border);
			this.background.addChild(this.borderSprite);
		}

		reloadFoodTextures() {
			gameObject.nodelist.forEach(node => {
				if (node.isFood) node.reloadTexture();
			})
		}

		reloadEjectedTextures() {
			gameObject.nodelist.forEach(node => {
				if (node.isEjected) node.reloadTexture();
			});
		}

		reloadVirusTexture() {
			TextureManagers.virus.loadVirusFromUrl(settings.virusImageUrl)
		}

		resetPlayerLongNames() {
			gameObject.playerManager.players.forEach(p => p.applyNameToSprite());
		}

		resetNameTextStyle() {
			gameObject.nodelist.forEach(node => {
				if (!node.isPlayerCell || !node.nameSprite) return;
				node.nameSprite.destroy(false);
				delete node.nameSprite;
			});

			const newStyle = this.game.settings.nameTextStyle;

			gameObject.playerManager.players.forEach(p => {
				const {nameSprite:sprite} = p;
				if (!sprite) return;
				const os = sprite.style.fill;
				sprite.style = newStyle;
				sprite.style.fill = os;
				sprite.updateText();
			});
		}

		/** @param {boolean} state */
		resetMassTextStyle(state) {
			if (state) {
				this.uninstallMassTextFont();
			}

			const textStyle = settings.massTextStyle;

			PIXI.BitmapFont.from('mass', textStyle, {
				chars: '1234567890k.'
			});

			while (gameObject.massTextPool.length) {
				gameObject.massTextPool.pop().destroy(false);
			}

			gameObject.nodelist.forEach(node => {
				if (!node.isPlayerCell || !node.massText) return;
				node.sprite.removeChild(node.massText);
				node.massText.destroy(false);
				delete node.massText;
			});
		}

		uninstallMassTextFont() {
			PIXI.BitmapFont.uninstall('mass');
		}
	};

	module.exports = Scene;
}, function(e, t, s) {
	var a = s(4),
		n = s(24),
		o = {};

	function i(e) {
		var t = a.cellSize,
			s = t / 2,
			o = d(s, e);
		o.position.set(s);
		var i = PIXI.RenderTexture.create(t, t);
		return n.render(o, i), i
	}
	e.exports = {
		getTexture: function(e) {
			var t = o[e];
			if (t) return t;
			return o[e] = i(e)
		},
		destroyCache: function() {
			for (var e in o) {
				o[e].destroy(true), delete o[e]
			}
		}
	};

	function d(e, t) {
		var s = new PIXI.Graphics;
		return s.beginFill(t), s.drawCircle(0, 0, e), s.endFill(), s
	}
}, function(e, t, s) {
	var a = s(4),
		n = s(24),
		o = {};

	function i(e) {
		var t = a.cellSize,
			s = t / 2,
			o = d(s, e);
		o.position.set(s);
		var i = PIXI.RenderTexture.create(t, t);
		return n.render(o, i), i
	}
	e.exports = {
		getTexture: function(e) {
			var t = o[e];
			if (t) return t;
			return o[e] = i(e)
		},
		destroyCache: function() {
			for (var e in o) {
				o[e].destroy(true), delete o[e]
			}
		}
	};

	function d(e, t) {
		var s = new PIXI.Graphics;
		return s.beginFill(t), s.drawRect(-e, -e, 2 * e, 2 * e), s.endFill(), s
	}
}, function(e, t, s) {
	var a = s(24),
		{
			loadImage: n
		} = s(8),
		o = PIXI.RenderTexture.create(200, 200),
		i = Promise.resolve();
	async function r(e) {
		await i, i = new Promise(async t => {
			var i = await n(e),
				s = PIXI.Sprite.from(i);
			s.width = s.height = 200, a.render(s, o, true), s.destroy(true), t()
		})
	}
	e.exports = {
		getTexture: function() {
			return o
		},
		loadVirusFromUrl: r
	}
}, function(module, _, __webpack_require__) {
	const StaticPlayer = __webpack_require__(126);

	/** @type {Game?} */
	let gameObject = null;

	class PlayerManager {
		/** @param {Game} gameObject */
		constructor() {
			if (gameObject === null) {
				/** @type {Game} */
				gameObject = __webpack_require__(1);
			}

			/** @type {Map<number, StaticPlayer>} */
			this.players = new Map();

			/** @type {number[]} */
			this.playersRemoving = [];

			/** @type {number} */
			this.botCount = 0;
		}

		/**
		 * @param {number} pid 
		 * @returns {StaticPlayer?}
		 */
		getPlayer = (pid) => this.players.has(pid) ? this.players.get(pid) : null;

		setPlayerData({
			pid,
			nickname: name,
			skin,
			skinUrl,
			nameColor,
			tagId,
			bot
		}) {
			if (!this.players.has(pid)) {
				this.players.set(pid, new StaticPlayer(gameObject, pid, bot));
				if (bot) this.botCount++;
			}

			const player = this.players.get(pid);

			if (skin) {
				skinUrl = `https://skins.vanis.io/s/${skin}`;
			}

			const nameChanged = player.setName(name, nameColor);
			const skinChanged = player.setSkin(skinUrl);
			const tagChanged = player.setTagId(tagId);

			if (nameChanged || skinChanged || tagChanged) {
				player.invalidateVisibility();
			}

			return player;
		}

		/** @param {StaticPlayer[]} players */
		invalidateVisibility(players = []) {
			for (const player of this.players.values()) {
				if (players.indexOf(player) === -1) {
					player.invalidateVisibility();
				}
			}
		}

		sweepRemovedPlayers() {
			const {replay:ReplayManager} = gameObject;
			const initial = ReplayManager.updateHistory[0]?.packetId || null;

			const {playersRemoving:list} = this;
			let i = 0;
			while (i < list.length) {
				const pid = list[i];
				if (!this.players.has(pid)) {
					list.splice(i, 1);
					continue;
				}
				const player = this.players.get(pid);
				if (!initial || !player.lastUpdateTick || initial > player.lastUpdateTick) {
					this.removePlayer(pid);
					list.splice(i, 1);
				} else {
					i++;
				}
			}
		}

		/** @param {number} pid */
		delayedRemovePlayer(pid) {
			this.playersRemoving.push(pid)
		}

		/** @param {number} pid */
		removePlayer(pid) {
			if (!this.players.has(pid)) return;
			const player = this.players.get(pid);
			if (player.bot) this.botCount--;
			player.clearCachedData();
			this.players.delete(pid);
		}

		destroy() {
			this.players.forEach((_, pid) => this.removePlayer(pid));
			this.botCount = 0;
			this.playersRemoving.splice(0, this.playersRemoving.length);
		}
	};

	module.exports = PlayerManager;
}, function(e, t, s) {
	var a = s(4),
		n = s(76),
		o = n.basic,
		i = n.basicd,
		d = a.cellSize;
	class l {
		constructor(e, t, s) {
			this.game = e, this.pid = t, this.bot = s, this.skinUrl = null, this.tagId = null, this.isMe = t === e.playerId || t === e.multiboxPid, this.texture = PIXI.RenderTexture.create(d, d), this.cellContainer = this.createCellContainer(), this.renderCell()
		}
		get["visibility"]() {
			if (this.game.tagId === this.tagId) return 1;
			return 2
		} ["setOutline"](e) {
			e = e || 0, this.outlineColor = e;
			var t = a.cellSize / 2,
				s = new PIXI.Graphics;
			s.lineStyle(20, e, 1), s.drawCircle(0, 0, t - 19 / 2), s.endFill(), s.pivot.set(-t), this.game.renderer.render(s, this.texture, false)
		} ["setCrown"](e) {
			this.hasCrown = e;
			for (var t = this.pid, s = this.game.nodelist, a = 0, n; a < s.length; a++) {
				n = s[a];
				if (n.pid !== t) continue;
				e ? n.addCrown() : n.removeCrown()
			}
		} ["createCellContainer"]() {
			var e = new PIXI.Container,
				t = this.getCellColor(),
				s = c(t);
			return e.pivot.set(-d / 2), e.addChild(s), e
		} ["createSkinSprite"](e) {
			var t = new PIXI.BaseTexture(e),
				s = new PIXI.Texture(t),
				n = new PIXI.Sprite(s);
			return n.width = n.height = a.cellSize, n.anchor.set(0.5), n
		} ["renderCell"]() {
			console.assert(this.cellContainer.children.length <= 3, "cellContainer has unexpected sprites"), this.game.renderer.render(this.cellContainer, this.texture, true);
			if (this.outlineColor) this.setOutline(this.outlineColor)
		} ["setTagId"](e) {
			if (!e) e = null;
			if (e === this.tagId) return false;
			return this.tagId = e, true
		} ["setNameColor"](e) {
			return e ? (e = parseInt(e, 16), this.nameColor = e, this.nameColorCss = PIXI.utils.hex2string(e)) : (this.nameColor = null, this.nameColorCss = null), this.nameColor
		} ["setName"](e, t) {
			if (!e) e = "Unnamed";
			if (this.nameFromServer === e && this.nameColorFromServer === t) return false;
			return this.nameFromServer = e, this.nameColorFromServer = t, this.applyNameToSprite(), true
		} ["applyNameToSprite"]() {
			var e = this.nameFromServer === "Unnamed",
				t = this.nameFromServer === "Long Name",
				n = e ? "" : this.nameFromServer,
				o = this.name,
				i = this.nameColor,
				r;
			if (!e && !t) r = this.setNameColor(this.nameColorFromServer);
			else r = this.setNameColor(null);
			this.setNameSprite(n, r);
			!e && !t && this.nameSprite.texture.width > a.cellLongNameThreshold && (t = true, n = "Long Name", r = this.setNameColor(null), this.setNameSprite(n, r));
			this.name = e ? "Unnamed" : n;
			if (o !== this.name || i !== this.nameColor) {
				var d = r || (this.isMe ? 16747520 : null);
				this.game.events.$emit("minimap-create-node", this.pid, n, r, d)
			}
		} ["setNameSprite"](e, t) {
			!this.nameSprite ? this.nameSprite = new PIXI.Text(e, a.nameTextStyle) : this.nameSprite.text = e, this.nameSprite.style.fill = t || 16777215, this.nameSprite.updateText()
		} ["setSkin"](e) {
			if (!e) e = null;
			if (e === this.skinUrl) return false;
			this.abortSkinLoaderIfExist();
			var t = this.destroySkin();
			if (t) this.renderCell();
			this.skinUrl = e;
			if (this.skinShown) this.loadSkinAndRender();
			return true
		} ["destroySkin"]() {
			if (!this.skinSprite) return false;
			return this.skinSprite.mask.destroy(true), this.skinSprite.destroy(true), this.skinSprite = null, true
		} ["loadSkinAndRender"]() {
			console.assert(!this.abortSkinLoader, "Called loadSkin while other skin was loading"), this.abortSkinLoaderIfExist(), this.abortSkinLoader = this.game.skinLoader.loadSkin(this.skinUrl, e => {
				this.skinSprite = this.createSkinSprite(e), this.skinSprite.mask = c(), this.cellContainer.addChild(this.skinSprite.mask, this.skinSprite), this.renderCell()
			})
		} ["invalidateVisibility"]() {
			var e, t, n, o = a.showNameColor;
			this.isMe ? (e = a.showOwnName, t = a.showOwnSkin, n = a.showOwnMass) : (e = a.showNames >= this.visibility, t = a.showSkins >= this.visibility, n = a.showMass >= this.visibility);
			e = a.namesEnabled && e, t = a.skinsEnabled && t, n = a.massEnabled && n;
			if (t && !this.skinShown) {
				if (this.skinSprite) this.skinSprite.visible = true, this.renderCell();
				else {
					if (this.skinUrl) this.loadSkinAndRender()
				}
			} else !t && this.skinShown && (this.abortSkinLoaderIfExist(), this.skinSprite && (this.skinSprite.visible = false, this.renderCell()));
			this.nameShown = e, this.skinShown = t, this.massShown = n, this.nameColorShown = o
		} ["abortSkinLoaderIfExist"]() {
			if (!this.abortSkinLoader) return;
			this.abortSkinLoader(), this.abortSkinLoader = null
		} ["getCellColor"]() {
			var e = this.game.seededRandom(this.pid),
				t = Math.floor(e * o.length);
			return (this.bot ? i : o)[t]
		} ["clearCachedData"]() {
			this.abortSkinLoaderIfExist(), this.destroySkin(), this.cellContainer.destroy(true), this.texture.destroy(true), this.texture.clearedFromCache = true, this.nameSprite && this.nameSprite.destroy(true), this.game.events.$emit("minimap-destroy-node", this.pid)
		}
	}
	e.exports = l;

	function c(e) {
		e = e || 0;
		var t = new PIXI.Graphics;
		return t.lineStyle(a.cellBorderSize, 0, 0.5), t.beginFill(e), t.drawCircle(0, 0, a.cellSize / 2), t.endFill(), t
	}
}, , function(e, t, s) {
	var a = s(129);
	e.exports = class {
		constructor() {
			this.loaders = {}, this.worker = new a, this.worker.addEventListener("message", this.onSkinLoaded.bind(this))
		} ["createLoader"](e) {
			return {
				image: null,
				error: null,
				callbacks: [e]
			}
		} ["clearCallbacks"]() {
			for (var e in this.loaders) delete this.loaders[e]
		} ["removeLoaderCallback"](e, t) {
			var s = e.callbacks.indexOf(t);
			if (s >= 0) e.callbacks.splice(s, 1)
		} ["loadSkin"](e, t) {
			var s = this.loaders[e];
			if (!s) return s = this.loaders[e] = this.createLoader(t), this.worker.postMessage(e), this.removeLoaderCallback.bind(this, s, t);
			if (s.image) return t(s.image), null;
			if (s.error) return null;
			return s.callbacks.push(t), this.removeLoaderCallback.bind(this, s, t)
		} ["onSkinLoaded"](e) {
			var {
				skinUrl: t,
				bitmap: s,
				error: a
			} = e.data, n = this.loaders[t];
			if (a) {
				n.error = true, n.callbacks = [];
				return
			}
			n.image = s;
			while (n.callbacks.length) n.callbacks.pop()(s)
		}
	}
}, function(module) {
	const workerCode = atob('YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsIChlKSA9PiB7CiAgICAoKGUpID0+IHsKICAgICAgZmV0Y2goZSwgewogICAgICAgIG1vZGU6ICJjb3JzIgogICAgICB9KQogICAgICAgIC50aGVuKChlKSA9PiBlLmJsb2IoKSkKICAgICAgICAudGhlbigoZSkgPT4gY3JlYXRlSW1hZ2VCaXRtYXAoZSkpCiAgICAgICAgLnRoZW4oKHMpID0+CiAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgc2tpblVybDogZSwKICAgICAgICAgICAgYml0bWFwOiBzCiAgICAgICAgICB9KQogICAgICAgICkKICAgICAgICAuY2F0Y2goKCkgPT4KICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgICAgICBza2luVXJsOiBlLAogICAgICAgICAgICBlcnJvcjogITAKICAgICAgICAgIH0pCiAgICAgICAgKTsKICAgIH0pKGUuZGF0YSk7CiAgfSk7');

	module.exports = function() {
		return new Worker(URL.createObjectURL(
			new Blob([workerCode], {
				type: 'text/javascript'
			})
		));

		// return new Worker(s.p + 'caca658228bca8ece583.worker.js')
	}
}, function(e, a, n) {
	var o = n(131),
		i = n(1),
		u = n(8),
		c = n(5),
		m = n(4),
		g = n(78),
		v = n(25),
		r = [],
		y = [],
		s = o.createInstance({
			name: "game-replays"
		});

	function l(e) {
		var t = e || r.length;
		r.splice(0, t), y.splice(0, t)
	}
	var w = t(new ArrayBuffer(1));

	function _(e) {
		e = e.map(e => {
			var t = {
				pid: e.pid,
				nickname: e.nameFromServer,
				skinUrl: e.skinUrl
			};
			if (e.bot) t.bot = true;
			if (e.tagId) t.tagId = e.tagId;
			if (e.nameColorFromServer) t.nameColor = e.nameColorFromServer;
			return t
		});
		var s = JSON.stringify(e),
			a = new v;
		a.uint8(16), a.utf8(s);
		var n = a.write();
		return t(n)
	}

	function d(e) {
		var t = new ArrayBuffer(3),
			s = new DataView(t);
		return s.setUint8(0, 8), s.setUint16(1, e, true), t
	}

	function C(e) {
		for (var t = 0, s = 0; s < e.length; s++) t += 1 + (e[s].type === 1 ? 2 : 0) + 2 + 2 + 2 + 2 + (e[s].flags ? 1 : 0);
		var n = new ArrayBuffer(1 + t + 1 + 2 + 2),
			o = new DataView(n);
		o.setUint8(0, 10);
		for (var a = 1, s = 0; s < e.length; s++) {
			var i = e[s],
				r = i.flags & 254,
				l = r ? 128 : 0;
			o.setUint8(a, i.type | l), a++;
			if (i.type === 1) o.setUint16(a, i.pid, false), a += 2;
			o.setUint16(a, i.id, false), a += 2, o.setInt16(a, i.nx, false), a += 2, o.setInt16(a, i.ny, false), a += 2, o.setUint16(a, i.nSize, false), a += 2;
			if (r) o.setUint8(a, r), a++
		}
		return o.setUint8(a, 0), a++, o.setUint16(a, 0, false), a += 2, o.setUint16(a, 0, false), a += 2, o
	}

	function t(e) {
		return btoa(String.fromCharCode.apply(null, new Uint8Array(e)))
	}

	function h(e) {
		e = atob(e);
		for (var t = new ArrayBuffer(e.length), s = new Uint8Array(t), n = 0; n < e.length; n++) s[n] = e.charCodeAt(n);
		return new DataView(t)
	}
	i.replay = {
		database: s,
		updateHistory: r,
		addHistory: function(e) {
			r.push(e), y.push(i.nodelist.map(e => {
				return {
					type: e.type,
					id: e.id,
					pid: e.pid,
					nx: e.nx,
					ny: e.ny,
					nSize: e.nSize
				}
			}));
			var t = m.replayDuration * 25;
			if (r.length > t) l(1)
		},
		clearHistory: l,
		play: function(e) {
			i.running && i.stop(), i.connection.close(), c.toast.close();
			var t = 1,
				s = e.split("|");
			s[0] === "REPLAY" && (t = parseInt(s[1]), s = s.slice(3));
			var n = s.map(h),
				o = g(new SmartBuffer(n.shift(), 1)),
				a = [];
			if (t >= 4) {
				while (n[0].getUint8(0)) a.push(n.shift());
				n.shift()
			} else a.push(n.shift());
			o.replayUpdates = n, i.start(o), a.forEach(e => {
				e.packetId = -1, i.parseMessage(e)
			}), i.playback.setStartingFrame(), i.showMenu(false)
		},
		save: function() {
			var e = r.slice(0);
			if (!e.length) return;
			var n = [];
			const {playerManager} = i;
			for (const player of playerManager.players.values()) {
				if (player.lastUpdateTick >= r[0].packetId) {
					n.push(player);
				}
			}
			e.splice(0, 1, C(y[0]));
			var p = t(i.initialDataPacket.buffer),
				a = _(n),
				h = e.map(e => t(e.buffer)).join("|"),
				v = u.getTimestamp(),
				g = i.getThumbnail(),
				k = [];
			k.push("REPLAY"), k.push(4), k.push(g), k.push(p);
			if (i.multiboxPid) k.push(d(i.multiboxPid));
			k.push(a), k.push(w), k.push(h);
			var b = k.join("|");
			s.setItem(v, b, () => {
				i.events.$emit("replay-added");
				if (m.showReplaySaved === 1) i.events.$emit("chat-message", "Replay saved!");
				else c.toast.fire({
					type: "info",
					title: "Replay saved!",
					timer: 1500
				})
			})["catch"](e => {
				console.error("replay.save", e);
				var t = "Error saving replay";
				if (typeof e === "string") t += ": " + e;
				else {
					if (e && e.message) t += ": " + e.message
				}
				c.toast.fire({
					type: "error",
					title: t
				})
			})
		}
	}
}, , function(module, _, __webpack_require__) {
	const gameObject = __webpack_require__(1);

	const {addOrUpdate, remove: removeCell} = __webpack_require__(79);

	class Replayer {
		constructor() {
			/** 
			 * @typedef {{[id:number]:CellData} | number[] | {[id:number]:boolean}} UpdateRecord 
			 * 
			 * Each frame in the replay data. 
			 * @type {UpdateRecord[]} 
			 **/
			this.updates = [];
			/** @type {boolean} */
			this.dry = false;
			/** @type {number} */
			this.index = 0;
		}

		/**
		 * Adds cell to eat queue if 'eid' is defined,
		 * otherwise the cell is added to remove queue.
		 * 
		 * @param {number} id  ID of the target cell
		 * @param {number} eid ID of the cell eating the target cell
		 */
		removeCell(id, eid) {
			const {updates:FramePool} = this;
			const curr = FramePool[0];
			curr[3][id] = true; /* mark as removed */
			const eaten = !!eid;
			const pool = curr[1 + (eaten ? 1 : 0)]; /* remove|eat queue */
			pool.push(id);
			eaten && pool.push(eid);
		}

		/**
		 * Custom parser for fast-parsing (eh) update records.
		 * 
		 * @param {SmartBuffer} buffer 
		 */
		parse(buffer) {
			const {updates:FramePool} = this;
			const NodePool = FramePool[0][0];

			for (;;) {
				const indicies = buffer.readUInt8(); /* type|flags */
				if (indicies === 0) break;

				const type = indicies & 0x0f;

				const pid = (type === 1) ? buffer.readUInt16BE() : null;

				const id = buffer.readUInt16BE();

				const positionChanged = !(indicies & 0x20);
				let x = null, y = null;

				if (positionChanged) {
					x = buffer.readInt16BE();
					y = buffer.readInt16BE();
				}

				const size = !(indicies & 0x40) ? buffer.readUInt16BE() : null;

				const extraFlags = (indicies << 24 >> 24) < 0 ? buffer.readUInt8() : 0;

				const data = {
					type: indicies, /* pass raw indicies as 'type' */
					pid,
					id,
					x,
					y,
					size,
					flags: (extraFlags | (type === 4 | (extraFlags > 15)))
				};

				NodePool[id] = data;
			}

			let count = buffer.readUInt16BE();

			while (count--) {
				const id = buffer.readUInt16BE();
				this.removeCell(id, 0);
			}

			count = buffer.readUInt16BE();

			while (count--) {
				this.removeCell(
					buffer.readUInt16BE(),
					buffer.readUInt16BE()
				);
			}
		}

		reset() {
			const {updates:FramePool} = this;
			FramePool.splice(0, FramePool.length);
			delete FramePool.index;
		}

		/** @param {DataView[]} packets */
		set(packets) {
			this.reset();
			this.dry = true;

			const {updates:FramePool} = this;

			let limit = packets.length;
			let i = 0;
			while (limit--) {
				FramePool.unshift([{}, [], [], {}]);
				const buffer = new SmartBuffer(packets[i++], 1);
				this.parse(buffer);
			}

			FramePool.reverse();
			delete this.dry;
			this.index = 0;
		}

		setStartingFrame() {
			const {nodes} = gameObject;

			const {updates:FramePool} = this;

			const [NodePool, RemovePool, EatenPool, RemovedPool] = FramePool;

			for (const id in nodes) {
				const node = nodes[id];
				if (id in RemovedPool) continue;
				if (id in NodePool) {
					NodePool[id].pid = node.pid;
				} else {
					NodePool[id] = {
						type: node.type,
						id: node.id,
						pid: node.pid,
						x: node.nx,
						y: node.ny,
						size: node.nSize,
						flags: node.flags
					};
				}
			}

			// iterate over each frame

			for (let i = 1; i < FramePool.length; i++) {
				const prev = FramePool[i - 1];
				const curr = FramePool[i];

				for (const id in curr[0]) {
					if (!(id in prev[0])) continue;

					const n1 = curr[0][id]; /* node in previous frame */
					const n2 = prev[0][id]; /* node in current frame */

					if (n1.type & 0x10) {
						n1.pid = n2.pid;
					}

					if (n1.type & 0x20) {
						n1.x = n2.x;
						n1.y = n2.y;
					}

					if (n1.type & 0x40) {
						n1.size = n2.size;
					}
				}

				for (const id in prev[0]) {
					if (!(id in curr[3]) && !(id in curr[0])) {
						curr[0][id] = prev[0][id];
					}
				}
			}
		}

		/**
		 * @param {number} position 
		 * @param {boolean} [clear] 
		 */
		seek(position, clear) {
			const startFrame = this.updates[position];
			for (const id in gameObject.nodes) {
				if (clear || !(id in startFrame[0])) removeCell(id);
			}

			// update to nodes in starting frame
			for (const id in startFrame[0]) {
				addOrUpdate(startFrame[0][id]);
			}

			this.index = position;
			gameObject.updateCamera(true);
		}

		next() {
			const {updates:FramePool} = this;

			if (this.index < FramePool.length) {
				const [NodePool, RemovePool, EatenPool] = FramePool[this.index++];

				for (const id in NodePool) {
					addOrUpdate(NodePool[id]);
				}

				let limit = RemovePool.length;
				let i = 0;

				while (i < limit) {
					removeCell(RemovePool[i++]);
				}

				limit = EatenPool.length;
				i = 0;

				while (i < limit) {
					removeCell(EatenPool[i++], EatenPool[i++]);
				}

				gameObject.updateCamera(true);
			} else {
				this.seek(0, true);
			}

			gameObject.events.$emit('replay-index-change', this.index);
		}
	};

	gameObject.playback = new Replayer();
}, function(_, exports, __webpack_require__) {
	exports.PlayerCell = __webpack_require__(134);
	exports.Food = __webpack_require__(135);
	exports.Virus = __webpack_require__(136);
	exports.EjectedMass = __webpack_require__(137);
	exports.DeadCell = __webpack_require__(138);
	exports.Crown = __webpack_require__(139);
}, function(e, t, s) {
	var a = s(14);

	function n(e) {
		var t = new PIXI.BitmapText("", {
				fontName: "mass",
				align: "right"
			}),
			s = e.strokeThickness || 0;
		return t.position.set(-s / 2, -s / 2), t.anchor.set(0.5, -0.6), t
	}
	class o extends a {
		constructor(e, t) {
			super(e), this.player = t, this.pid = t.pid;
			if (t.hasCrown) this.addCrown()
		} ["addCrown"]() {
			if (this.crownSprite) {
				console.error("addCrown: crown already exists");
				return
			}
			var e, t = this.game.crownPool;
			if (t.length) e = t.pop();
			else e = PIXI.Sprite.from("/img/crown.png"), e.scale.set(0.7), e.pivot.set(0, 643), e.anchor.x = 0.5, e.rotation = -0.5, e.alpha = 0.7, e.zIndex = 2;
			this.crownSprite = e, this.sprite.addChild(e)
		} ["removeCrown"]() {
			var e = this.crownSprite;
			if (!e) {
				console.error("removeCrown: crown doesnt exist");
				return
			}
			this.sprite.removeChild(e), this.game.crownPool.push(e), this.crownSprite = null
		} ["onUpdate"]() {
			var e = this.game.settings,
				t = this.game.scene.container.scale.x * this.size * this.game.renderer.resolution,
				s = t > e.smallTextThreshold;
			this.player.massShown && !this.massText && s && (this.massText = this.game.massTextPool.pop() || n(e.massTextStyle), this.massText.zIndex = 0, this.sprite.addChild(this.massText));
			this.player.nameShown && !this.nameSprite && this.player && this.player.nameSprite && s && (this.nameSprite = new PIXI.Sprite(this.player.nameSprite.texture), this.nameSprite.anchor.set(0.5), this.nameSprite.zIndex = 1, this.sprite.addChild(this.nameSprite));
			if (this.crownSprite) this.crownSprite.visible = t > 16 && e.showCrown;
			if (this.nameSprite) this.nameSprite.visible = this.player.nameShown && s;
			if (!this.massText) return;
			if (this.player.massShown && s) {
				var a = this.game.getMassText(this.nSize * this.nSize / 100);
				this.massText.text = a, this.massText.visible = true
			} else {
				if (this.massText.visible) this.massText.visible = false
			}
		} ["onDestroy"]() {
			this.massText && (this.sprite.removeChild(this.massText), this.game.massTextPool.push(this.massText));
			var e = this.crownSprite;
			if (e) this.removeCrown()
		}
	}
	o.prototype.type = 1, o.prototype.isPlayerCell = true, e.exports = o
}, function(e, t, s) {
	var a = s(1),
		n = s(14),
		o = s(12),
		i = s(4),
		l = s(76);

	function d(e) {
		var t;
		if (i.useFoodColor) t = PIXI.utils.string2hex(i.foodColor);
		else t = l.neon[e % l.neon.length];
		return o.cells.getTexture(t)
	}
	class c extends n {
		constructor(e) {
			e.texture = d(e.id), super(e)
		} ["reloadTexture"]() {
			this.texture = d(this.id), this.sprite.texture = this.texture
		}
	}
	c.prototype.type = 4, c.prototype.isFood = true, e.exports = c
}, function(e, t, s) {
	var a = s(14),
		n = s(12);
	class o extends a {
		constructor(e) {
			e.texture = n.virus.getTexture(), super(e)
		} ["resetTexture"]() {
			this.destroySprite(), this.texture = n.virus.getTexture(), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(0.5), this.sprite.gameData = this
		}
	}
	o.prototype.type = 2, o.prototype.isVirus = true, e.exports = o
}, function(e, t, s) {
	var a = s(4),
		n = s(14),
		o = s(12);

	function i() {
		var e = PIXI.utils.string2hex(a.ejectedColor);
		return o.cells.getTexture(e)
	}
	class r extends n {
		constructor(e) {
			e.texture = i(), super(e)
		} ["reloadTexture"]() {
			this.texture = i(), this.sprite.texture = this.texture
		}
	}
	r.prototype.type = 3, r.prototype.isEjected = true, e.exports = r
}, function(e, t, s) {
	var a = s(14),
		n = s(12);
	class o extends a {
		constructor(e, t, s) {
			e.texture = n[s ? "squares" : "cells"].getTexture(t || 4210752), super(e), this.sprite.alpha = 0.5
		}
	}
	o.prototype.type = 5, o.prototype.isDead = true, e.exports = o
}, function(e, t, s) {
	var a = s(14);
	class n extends a {
		constructor(e) {
			e.texture = PIXI.Texture.from("/img/crown.png"), super(e), this.sprite.alpha = 0.7
		}
	}
	n.prototype.type = 6, n.prototype.isCrown = true, e.exports = n
}, function(i, u, b) {
	// wasm module
}, function(e, t, s) {
	e.exports = s.p + "js/wauth3.wasm"
}, function(e, t, a) {
	var n = a(1),
		o = a(19),
		i = a(5),
		d = a(159),
		// c = a(163),
		p = a(25),
		{
			createBuffer: u,
			writePlayerData: m
		} = a(8);
	n.connection = {}, n.connection.opened = false, n.connection.send = function(e) {
		if (n.connection.opened) n.ws.send(e)
	}, n.connection.sendMouse = function() {
		var e = u(5);
		e.setUint8(0, 16), e.setInt16(1, n.mouse.x, true), e.setInt16(3, n.mouse.y, true), n.connection.send(e)
	}, n.connection.sendOpcode = function(e) {
		var t = u(1);
		t.setUint8(0, e), n.connection.send(t)
	}, n.connection.sendJoinData = function(e) {
		var t = new p;
		t.uint8(5), t.uint8(n.clientVersion), t.uint8Array(e), m(t);
		var s = localStorage.vanisToken;
		if (s) {
			if (/^wss?:\/\/[a-zA-Z0-9_-]+\.vanis\.io/i.test(n.ws.url) || false) t.utf8(s)
		}
		n.connection.send(t.write())
	}, n.connection.sendRecaptchaToken = function(e) {
		var t = new p;
		t.uint8(11), t.utf8(e), n.connection.send(t.write())
	}, n.connection.sendChatMessage = function(e) {
		for (var t = unescape(encodeURIComponent(e)), s = [99], a = 0; a < t.length; a++) s.push(t.charCodeAt(a));
		var o = new Uint8Array(s).buffer;
		n.connection.send(o)
	};
	var h = null,
		g = 0;
	n.connection.preopen = function(e) {
		h && (h.abort(), h = null);
		var t = new AbortController;
		o.get(e.replace("ws", "http"), {
			withCredentials: true,
			responseType: "text",
			signal: t.signal
		}).then(t => t.status === 200 ? n.connection.open(e) : s(1))["catch"](() => s(2)), h = t
	}, n.connection.open = function(e) {
		h = null;
		if (n.running) n.stop();
		n.connection.close(), n.events.$emit("chat-clear"), n.connection.opened = true;
		var t = n.ws = new WebSocket(e, "tFoL46WDlZuRja7W6qCl");
		t.binaryType = "arraybuffer", t.packetId = 0, t.onopen = function() {
			if (!n.connection.opened) return;
			n.currentWsId = t.id = g++, n.events.$emit("players-menu", t.id), n.events.$emit("account-menu", t.id), n.events.$emit("chatbox-menu", t.id), n.events.$emit("options-menu", t.id), n.events.$emit("replays-menu", t.id), n.state.connectionUrl = e, t.onclose = l
		}, t.onclose = function() {
			s(0)
		}, t.onmessage = function(e) {
			d(new DataView(e.data))
		}
	}, n.connection.close = function() {
		if (!n.ws) return;
		n.state.connectionUrl = null, n.ws.onmessage = null, n.ws.onclose = null, n.ws.onerror = null, n.ws.close(), delete n.ws, n.connection.opened = false
	};

	function v(e, t) {
		i.toast.fire({
			type: t ? "error" : "info",
			title: e,
			timer: t ? 5000 : 2000
		})
	}

	function s(e = 0) {
		h = null, delete n.currentWsId, n.connection.opened = false, v(["Connection failed!", "Cannot connect!", "Connection rejected!"][e], true)
	}

	function l(e) {
		delete n.currentWsId, n.connection.opened = false;
		if (n.running) n.stop();
		if (e.code === 1003) setTimeout(() => !n.connection.opened && n.events.$emit("reconnect-server"), 1500), v("Server restarting...");
		else {
			var t = "You have been disconnected";
			if (e.reason) t += " (" + e.reason + ")";
			v(t, true)
		}
		n.showMenu(true, true)
	}
}, , , , , , , , , , , , , , , , , function(module, _, __webpack_require__) {
	const gameObject = __webpack_require__(1);
	const settings = __webpack_require__(4);

	const Swal = __webpack_require__(5);

	const parseInitialData = __webpack_require__(78);

	const {encodeHTML} = __webpack_require__(8);

	/**
	 * Parses the packet containing all players'
	 * leaderboard positions with their corresponding
	 * player ids, names, and their (optional) name color.
	 *
	 * @param {SmartBuffer} buffer
	 */
	gameObject.parseLeaderboard = (buffer) => {
		/** @type {Array<{pid:number;position:number;text:string,color:string?,bold:boolean}>} */
		const l = [];

		for (;;) {
			const pid = buffer.readUInt16LE();

			if (pid === 0) {
				/* eof */
				gameObject.events.$emit('leaderboard-update', l);
				return;
			}

			const player = gameObject.playerManager.getPlayer(pid);

			if (!player) continue;

			const entry = {
				pid: pid,
				position: l.length + 1,
				text: player.name,
				color: player.nameColorCss || '#ffffff',
				bold: !!player.nameColor
			};

			l.push(entry);
		}
	};

	/**
	 * Parses the packet containing all players'
	 * minimap positions with their corresponding
	 * player ids.
	 *
	 * @param {SmartBuffer} buffer
	 */
	gameObject.parseMinimap = (buffer) => {
		/** @type {Array<{pid:number;x:number;y:number}>} */
		const l = [];

		for (;;) {
			const pid = buffer.readUInt16LE();

			if (pid === 0) {
				/* eof */
				gameObject.events.$emit('minimap-positions', l);
				return;
			}

			buffer.offset++; /* unused byte */

			const x = buffer.readUInt8();
			const y = buffer.readUInt8();

			l.push({
				pid: pid,
				x: x / 0xff,
				y: y / 0xff
			});
		}
	};

	/**
	 * Parses the packet containing new player data,
	 * and changes to existing players.
	 * @param {SmartBuffer} buffer
	 */
	gameObject.parsePlayers = (buffer) => {
		const playersData = JSON.parse(buffer.readEscapedString()),
			activePlayer = playersData.find(x => x.pid === gameObject.playerId),
			tagChanged = activePlayer && gameObject.setTagId(activePlayer.tagId);

		const {playerManager} = gameObject;

		const players = [];

		for (const data of playersData) {
			const player = playerManager.setPlayerData(data);
			players.push(player);
		}

		if (tagChanged) {
			gameObject.events.$emit('minimap-positions', []);
			playerManager.invalidateVisibility(players);
		}
	}

	/** @param {DataView} view */
	const parseMessage = (view) => {
		const buffer = new SmartBuffer(view);

		const op = buffer.readUInt8();
		/*console.log('Running OP', op);*/
		switch (op) {
			case 1: {
				console.log(parseInitialData)
				const data = parseInitialData(buffer);
				gameObject.initialDataPacket = view;
				gameObject.start(data);
				return;
			}

			case 2: {
				const data = new Uint8Array(view.buffer, 1);
				gameObject.connection.sendJoinData(new XorKey(data).build());
				return;
			}

			case 3: {
				const elapsed = Date.now() - gameObject.pingstamp;
				gameObject.updateStats(elapsed);
				return;
			}
			case 4: {
				const {playerManager} = gameObject;

				for (;;) {
					const pid = buffer.readUInt16LE();
					if (pid === 0) return;

					playerManager.delayedRemovePlayer(pid);
				}
			}

			case 6: {
				gameObject.connection.sendOpcode(6);
				return;
			}

			case 7: {
				const flags = buffer.readUInt8();

				let from, to;

				if (flags & 1) {
					const pid = buffer.readUInt16LE();
					to = gameObject.playerManager.getPlayer(pid);
				}

				if (flags & 2) {
					const pid = buffer.readUInt16LE();
					from = gameObject.playerManager.getPlayer(pid);
				}

				if (from) {
					from.setCrown(false);
				}

				if (to) {
					to.setCrown(true);
				}

				return;
			}

			case 8: {
				gameObject.multiboxPid = buffer.readUInt16LE();
				return;
			}

			case 9: {
				const {playerManager} = gameObject;

				/** @type {number} */
				let pid = gameObject.activePid;
				if (pid) {
					playerManager.getPlayer(pid).setOutline(0xffffff);
				}

				pid = gameObject.activePid = buffer.readUInt16LE();
				playerManager.getPlayer(pid).setOutline(0xff00ff);
				return;
			}

			case 10: {
				if (view.packetId == null) {
					view.packetId = ++gameObject.ws.packetId;
				}

				gameObject.timestamp = performance.now();

				const {nodesOwn: cellCache} = gameObject;
				const ownedCells = gameObject.nodesOwn = {};

				gameObject.isAlive = false;

				gameObject.parseNodes(buffer, view.packetId);

				const {replay:ReplayManager} = gameObject;
				if (!gameObject.spectating && !gameObject.replaying) {
					ReplayManager.addHistory(view);
				} else {
					ReplayManager.clearHistory();
				}

				const {state:gameState} = gameObject;
				gameState.isAlive = gameObject.isAlive;

				if (gameObject.isAlive) {
					gameObject.spectating = false;
				} else {
					if (gameState.isAutoRespawning && ++gameObject.ticksSinceDeath === 37) {
						gameObject.triggerAutoRespawn();
					}
				}

				delete gameObject.isAlive;

				let spawned = true;
				for (const id in ownedCells) {
					if (id in cellCache) {
						spawned = false;
						break;
					}
				}

				gameObject.nodesOwn = ownedCells;

				if (spawned) {
					gameObject.highscore = 0;
					gameObject.events.$emit('reset-cautions');
					gameObject.mouseFrozen = false;
				}

				gameObject.serverTick++;
				gameObject.playerManager.sweepRemovedPlayers();
				gameObject.updateCamera(true);
				return;
			}

			case 11: {
				gameObject.parseLeaderboard(buffer);
				return;
			}
			case 12: {
				gameObject.parseMinimap(buffer);
				return;
			}

			case 13: {
				const pid = buffer.readInt16LE();
				const text = buffer.readString16();

				if (pid === 0) {
					gameObject.events.$emit('chat-message', text);
					return;
				}

				const player = gameObject.playerManager.getPlayer(pid);
				if (!player) return;

				const message = { pid, text, from: player.name };
				if (player.nameColorCss) message.fromColor = player.nameColorCss;

				gameObject.events.$emit('chat-message', message);
				return;
			}

			case 14: {
				const flags = buffer.readUInt8();

				const options = {};

				if (flags & 2) {
					const typeId = buffer.readUInt8();

					const list = {
						1: 'success',
						2: 'error',
						3: 'warning',
						4: 'info'
					};

					if (typeId in list) {
						options.type = list[typeId];
					}
				}

				if (flags & 4) {
					options.timer = buffer.readUInt16LE();
				}

				options.title = encodeHTML(buffer.readString());

				Swal.toast.fire(options);
				return;
			}

			case 15: {
				const {playerManager} = gameObject;

				for (;;) {
					const pid = buffer.readUInt8();
					if (pid === 0) return;

					playerManager.setPlayerData({
						pid,
						nickname: buffer.readString16(),
						skinUrl: buffer.readString()
					});
				}
			}

			case 16: {
				gameObject.parsePlayers(buffer);
				return;
			}

			case 17: {
				const {camera} = gameObject;
				camera.sx = buffer.readInt16LE();
				camera.sy = buffer.readInt16LE();
				return;
			}

			case 18: {
				gameObject.replay.clearHistory();
				gameObject.clearNodes();
				return;
			}

			case 19: {
				const levelUp = !!buffer.readUInt8();
				const newXp = buffer.readUInt32LE();

				gameObject.events.$emit('xp-update', newXp);

				if (!levelUp) return;

				const level = buffer.readUInt16LE();

				Swal.toast.fire({
					title: `You have reached level ${level}!`,
					background: '#b37211',
					timer: 3000
				});

				return;
			}

			case 20: {
				gameObject.app.deathStats = {
					timeAlive: buffer.readUInt16LE(),
					killCount: buffer.readUInt16LE(),
					highscore: buffer.readUInt32LE()
				};

				const {state:gameState} = gameObject;

				gameState.deathDelay = true;

				if (gameObject.shouldAutoRespawn()) {
					gameState.isAutoRespawning = true;
					gameObject.ticksSinceDeath = 0;
				} else {
					gameObject.lastDeathTime = Date.now();
				}

				if (!gameState.isAutoRespawning) {
					gameObject.deathTimeout = setTimeout(gameObject.triggerDeathDelay, 900);
				}

				return;
			}

			case 21: { return; }

			case 22: {
				// if (!window.grecaptcha) {
				// 	alert('Captcha library is not loaded');
				// 	return;
				// }
				gameObject.events.$emit('show-image-captcha');
				return;
			}

			case 23: {
				gameObject.state.spectators = buffer.readUInt16LE();
				return;
			}

			case 24: {
				gameObject.serverTick = buffer.readUInt32LE();
				gameObject.events.$emit('restart-timing-changed', buffer.readUInt32LE());
				return;
			}

			case 25: {
				gameObject.events.$emit('update-cautions', { custom: buffer.readString16() });
				return;
			}

			case 26: {
				const {state:gameState} = gameObject;
				gameState.playButtonDisabled = !!buffer.readUInt8();
				if (buffer.length > buffer.offset + 1) {
					gameState.playButtonText = buffer.readString() || 'Play';
				}
				return;
			}
		}
	}

	module.exports = gameObject.parseMessage = parseMessage
}, function(e) {
	// unused - previously 'parsePlayer'
	e.exports = function(e) {
		var t = 1,
			s = e.getInt16(t, true);
		t += 2;
		var a = "",
			n = "";
		while ((n = e.getUint16(t, true)) != 0) {
			t += 2, a += String.fromCharCode(n)
		}
		return {
			pid: s,
			text: a
		}
	}
}, function(e) {
	// unused - previously 'parseMinimap'
	e.exports = function(e) {
		var t = 1,
			s = [];
		while (1) {
			var a = e.getUint16(t, true);
			t += 3;
			if (!a) break;
			var n = e.getUint8(t, true) / 255;
			t += 1;
			var o = e.getUint8(t, true) / 255;
			t += 1, s.push({
				pid: a,
				x: n,
				y: o
			})
		}
		return s
	}
}, function(e) {
	// unused - previously 'parseLeaderboard'
	e.exports = function(e, t) {
		var s = 1,
			a = [];
		while (1) {
			var n = t.getUint16(s, true);
			s += 2;
			if (!n) break;
			var o = e.playerManager.getPlayer(n);
			if (!o) continue;
			a.push({
				pid: n,
				position: 1 + a.length,
				text: o.name,
				color: o.nameColorCss || "#ffffff",
				bold: !!o.nameColor
			})
		}
		return a
	}
}, function(e) {
	// pathetic
	// var t = window.WebSocket;
	// delete window.WebSocket, setTimeout(() => {}), e.exports = t
}, function(e, n, o) {
	var i = o(1);
	o(165);
	var u = o(66),
		m = o(5),
		{
			encodeHTML: c
		} = o(8),
		g = i.renderer.view,
		v = {};
	window.addEventListener("blur", () => {
		if (!i.settings.rememeberEjecting && u.get().feedMacro in v) i.actions.feed(false);
		v = {}
	});
	var f = localStorage.adminMode,
		y = /firefox/i.test(navigator.userAgent),
		r = y ? "DOMMouseScroll" : "wheel";
	i.eventListeners = function(e) {
		if (e) {
			window.addEventListener("resize", s), g.addEventListener("mousedown", C), g.addEventListener(r, x, {
				passive: true
			}), g.addEventListener("contextmenu", _), document.addEventListener("mouseup", w), document.body.addEventListener("mousemove", l), document.body.addEventListener("keydown", b), document.body.addEventListener("keyup", k);
			window.onbeforeunload = () => "Are you sure you want to close the page?"
		} else {
			window.removeEventListener("resize", s), g.removeEventListener("mousedown", C), g.removeEventListener(r, x), g.removeEventListener("contextmenu", _), document.removeEventListener("mouseup", w), document.body.removeEventListener("mousemove", l), document.body.removeEventListener("keydown", b), document.body.removeEventListener("keyup", k);
			window.onbeforeunload = null
		}
	};

	function _() {
		var e = i.actions.findPlayerUnderMouse(),
			t = e && e.player;
		if (t) i.events.$emit("context-menu", event, t)
	}

	function s() {
		i.scene.setPosition()
	}

	function l(e) {
		var t = e.clientX,
			s = e.clientY;
		if (i.settings.mouseFreezeSoft && (i.rawMouse.x !== t || i.rawMouse.y !== s)) i.actions.freezeMouse(false);
		i.rawMouse.x = t, i.rawMouse.y = s, i.updateMouse()
	}

	function C(e) {
		e.preventDefault(), g.focus(), d("MOUSE" + e.button, true, e)
	}

	function w(e) {
		S("MOUSE" + e.button, true, e)
	}

	function b(e) {
		var t = e.target === g;
		if (!t && e.target !== document.body) return;
		var s = u.convertKey(e.code);
		if (e.ctrlKey && s === "TAB") return;
		if (d(s, t, e)) e.preventDefault()
	}

	function k(e) {
		S(u.convertKey(e.code), e)
	}

	function x(e) {
		var t = 0;
		if (e.wheelDelta) t = e.wheelDelta / -120;
		else {
			if (e.detail) t = e.detail / 3
		}
		if (e.shiftKey && f && i.selectedPlayer) {
			if (t < 0) i.connection.sendChatMessage("/mass " + i.selectedPlayer + " +500");
			else i.connection.sendChatMessage("/mass " + i.selectedPlayer + " -500");
			return
		}
		i.actions.zoom(t)
	}

	function d(e, t, s) {
		if (e in v) return false;
		v[e] = true;
		if (e === "ESCAPE") {
			if (i.replaying) v = {}, i.stop(), i.showMenu(true);
			else {
				if (i.app.showDeathScreen) i.events.$emit("continue-deathscreen");
				else {
					if (i.state.isAutoRespawning) i.triggerDeathDelay(true);
					else i.showMenu()
				}
			}
			return true
		}
		if (e === "ENTER") return void i.events.$emit("chat-focus");
		if (!t) return;
		if (s.shiftKey && f && i.selectedPlayer && e === "MOUSE0") return i.connection.sendChatMessage("/teleport " + i.selectedPlayer + " " + i.mouse.x + " " + i.mouse.y), true;
		if (i.spectating && e === "MOUSE0") {
			var a = i.actions.findPlayerUnderMouse();
			if (a) i.actions.spectate(a.pid);
			return true
		}
		if (s.shiftKey && f) {
			if (e === "V") i.connection.sendChatMessage("/virus " + i.mouse.x + " " + i.mouse.y);
			if (i.selectedPlayer) {
				if (e === "F") i.connection.sendChatMessage("/freeze " + i.selectedPlayer);
				if (e === "D") i.connection.sendChatMessage("/ignoreBorders " + i.selectedPlayer);
				if (e === "N") P(i.selectedPlayer);
				if (e === "I") I(i.selectedPlayer, true);
				if (e === "K") I(i.selectedPlayer);
				if (e === "M") h(i.selectedPlayer);
				if (e === "J") M(i.selectedPlayer);
				if (e === "G") p(i.selectedPlayer);
				if (e === "B") T(i.selectedPlayer)
			}
			return true
		}
		return u.press(e)
	}

	function S(e) {
		if (!(e in v)) return;
		delete v[e], u.release(e)
	}

	function t(e, t) {
		m.instance.fire({
			input: "text",
			inputPlaceholder: "0 to unmute",
			showCancelButton: true,
			html: e
		}).then(e => {
			if (e.dismiss) return;
			var s = parseInt(e.value);
			if (isNaN(s)) {
				m.alert("Invalid hour value");
				return
			}
			if (s > 100000) s = 100000;
			t(s)
		})
	}

	function h(e) {
		var s = i.playerManager.players[e];
		if (!s) return;
		t("Mute account of \"" + c(s.name) + "\" for hours:", t => {
			i.connection.sendChatMessage("/muteAccount " + e + " " + t)
		})
	}

	function p(e) {
		var s = i.playerManager.players[e];
		if (!s) return;
		t("Ban account of \"" + c(s.name) + "\" for hours:", t => {
			i.connection.sendChatMessage("/banAccount " + e + " " + t)
		})
	}

	function M(e) {
		var t = i.playerManager.players[e];
		if (!t) return;
		m.confirm("IP mute player \"" + c(t.name) + "\" in this server until restart?", () => {
			i.connection.sendChatMessage("/mute " + e)
		})
	}

	function T(e) {
		var t = i.playerManager.players[e];
		if (!t) return;
		m.confirm("IP ban player \"" + c(t.name) + "\"", () => {
			i.connection.sendChatMessage("/ban " + e)
		})
	}

	function P(e) {
		var t = i.playerManager.players[e];
		if (!t) return;
		m.instance.fire({
			input: "text",
			showCancelButton: true,
			confirmButtonText: "Send",
			html: "Send notification to player \"" + c(t.name) + "\""
		}).then(t => {
			if (t.value) i.connection.sendChatMessage("/notify " + e + " " + t.value)
		})
	}

	function I(e, t = false) {
		var s = i.playerManager.players[e];
		if (!s) return;
		var a = "Kick player \"" + c(s.name) + "\"";
		m.confirm(a, () => {
			i.connection.sendChatMessage((t ? "/disconnect " : "/kick ") + e)
		})
	}
}, function(e, t, s) {
	var a = s(1),
		n = s(4),
		o = s(25),
		{
			createBuffer: i,
			writePlayerData: r
		} = s(8),
		l = a.actions = {};
	l.spectate = e => {
		if (a.state.isAlive) return false;
		a.spectating = true;
		var t = i(e ? 3 : 1);
		t.setUint8(0, 2);
		if (e) t.setInt16(1, e, true);
		return a.connection.send(t), true
	}, l.join = () => {
		var e = new o;
		e.uint8(1), r(e), a.connection.send(e.write())
	}, l.spectateLockToggle = () => {
		a.connection.sendOpcode(10)
	}, l.feed = e => {
		var t;
		e != null ? (t = i(2), t.setUint8(0, 21), t.setUint8(1, +e)) : (t = i(1), t.setUint8(0, 21)), a.connection.send(t)
	}, l.freezeMouse = e => {
		if (!a.running) return;
		if (e === undefined) e = !a.mouseFrozen;
		e && (l.stopMovement(false), l.lockLinesplit(false), a.updateMouse(true), a.connection.sendMouse()), a.mouseFrozen = e, a.events.$emit("update-cautions", {
			mouseFrozen: e
		})
	}, l.stopMovement = e => {
		if (!a.running) return;
		if (e === undefined) e = !a.moveToCenterOfCells;
		e && (l.freezeMouse(false), l.lockLinesplit(false)), a.moveToCenterOfCells = e, a.events.$emit("update-cautions", {
			moveToCenterOfCells: e
		})
	}, l.lockLinesplit = e => {
		if (!a.running) return;
		if (e === undefined) e = !a.stopMovePackets;
		e && (a.updateMouse(), a.connection.sendMouse(), a.connection.sendOpcode(15), l.freezeMouse(false), l.stopMovement(false)), a.stopMovePackets = e, a.events.$emit("update-cautions", {
			lockLinesplit: e
		})
	}, l.linesplit = () => {
		l.freezeMouse(true), l.split(3);
		if (l.linesplitUnlock) clearTimeout(l.linesplitUnlock);
		l.linesplitUnlock = setTimeout(() => {
			delete l.linesplitUnlock, l.freezeMouse(false)
		}, 1500)
	}, l.split = (e, t = 0) => {
		if (!a.stopMovePackets) a.connection.sendMouse();
		if (t) return setTimeout(() => l.split(e), t);
		var s = i(2);
		s.setUint8(0, 17), s.setUint8(1, e), a.connection.send(s), a.splitCount += e;
		if (a.splitCount <= 2) a.moveWaitUntil = performance.now() + 300;
		else a.moveWaitUntil = 0, a.splitCount = 0
	}, l.switchMultibox = () => {}, l.zoom = e => {
		var t = Math.pow(1 - n.cameraZoomSpeed / 100, e);
		a.mouseZoom = Math.min(Math.max(a.mouseZoom * t, a.mouseZoomMin), 1)
	}, l.setZoomLevel = e => {
		a.mouseZoom = 0.8 / Math.pow(2, e - 1)
	}, l.spectatePlayer = () => {
		if (!a.spectating) return;
		var e = l.findPlayerUnderMouse(true);
		if (e) a.actions.spectate(target.pid)
	}, l.selectPlayer = () => {
		var e = l.findPlayerUnderMouse(true);
		a.selectedPlayer = e && e.pid
	}, l.findPlayerUnderMouse = (closest) => {
		const {x:mx, y:my} = a.mouse;

		let maxSize = 0, player = null;

		a.nodelist.filter(x => !!x.pid).sort((a, b) => a.size - b.size).forEach(node => {
			if (!node.isPlayerCell) return;

			const dx = node.x - mx;
			const dy = node.y - my;
			const d = Math.sqrt(Math.abs(dx * dx + dy * dy)) - node.size;

			if (closest) {
				if (d < maxSize) {
					maxSize = d;
					player = node;
				}
			} else if (d <= 0) {
				maxSize = node.size;
				player = node;
			}
		});

		return player;
	}, l.toggleSkins = function(e) {
		e = e === undefined ? !n.skinsEnabled : e, n.set("skinsEnabled", e), a.playerManager.invalidateVisibility()
	}, l.toggleNames = function(e) {
		e = e === undefined ? !n.namesEnabled : e, n.set("namesEnabled", e), a.playerManager.invalidateVisibility()
	}, l.toggleMass = function() {
		var e = !n.massEnabled;
		n.set("massEnabled", e), a.playerManager.invalidateVisibility()
	}, l.toggleFood = function(e) {
		e = e === undefined ? !n.foodVisible : e, n.set("foodVisible", e), a.scene.food.visible = e
	}, l.toggleHud = function() {
		var e = !a.app.showHud;
		a.app.showHud = e, n.set("showHud", e)
	}, l.toggleChat = function() {
		var e = !n.showChat;
		n.set("showChat", e);
		if (a.running) a.events.$emit("chat-visible", {
			visible: e
		})
	}, l.toggleChatToast = function() {
		var e = !n.showChatToast;
		n.set("showChatToast", e), a.events.$emit("chat-visible", {
			visibleToast: e
		})
	}
}, function(e, t, s) {
	'use strict';
	var a = s(29),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(32),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(33),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(34),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(35),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(36),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(37),
		n = s.n(a),
		o = n.a
}, function() {}, , , , , , function() {}, , function() {}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
	'use strict';
	var a = s(40),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(41),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(42),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(43),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(44),
		n = s.n(a),
		o = n.a
}, function() {}, function(module, _, __webpack_require__) {
	class Api {
		/**
		 * @param {string} endpointUrl 
		 * @param {string} token
		 */
		constructor(endpointUrl, token) {
			this.url = endpointUrl;
			this.vanisToken = token;
		}

		/** @param {string} token */
		setToken(token) {
			this.vanisToken = token;
			localStorage.vanisToken = token
		}

		clearToken() {
			this.vanisToken = null;
			delete localStorage.vanisToken;
		}

		/**
		 * 
		 * @param {string} method 
		 * @param {string} path 
		 * @returns {string | object | null}
		 */
		async call(method, path) {
			/** @type {RequestInit} */
			const options = {
				method,
				credentials: 'omit',
				mode: 'same-origin',
				redirect: 'error',
				headers: {
					Accept: 'application/json, text/plain'
				}
			};

			if (!!this.vanisToken) {
				options.headers['Authorization'] = `Vanis ${this.vanisToken}`;
			}

			try {
				return await fetch(this.url + path, options);
			} catch (e) {
				return {
					ok: false,
					status: 0,
					statusText: 'Client error',
					text: async () => e.message
				}
			}
		}

		get = (options) => this.call('GET', options);
	};

	module.exports = new Api('https://vanis.io/api', localStorage.vanisToken ?? null);
}, function(e) {
	var t = 0.1;
	e.exports = {
		getXp: function(e) {
			return Math.round(e * e / (t * t))
		},
		getLevel: function(e) {
			return Math.floor(Math.sqrt(e) * t)
		}
	}
}, function(e, t, s) {
	'use strict';
	var a = s(45),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(46),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(47),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(48),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(49),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(50),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(51),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(52),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(53),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(54),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(57),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(58),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(59),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(60),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(61),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(62),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, t, s) {
	'use strict';
	var a = s(63),
		n = s.n(a),
		o = n.a
}, function() {}, function(e) {
	e.exports = new class {
		constructor() {
			this.seenList = this.parseSeen(localStorage.seenNotifications)
		} ["parseSeen"](e) {
			if (!e) return [];
			try {
				var t = JSON.parse(e);
				if (Array.isArray(t)) return t
			} catch (e) {
				console.error("notifications.parseSeen:", e.message)
			}
			return []
		} ["saveSeen"]() {
			try {
				localStorage.seenNotifications = JSON.stringify(this.seenList)
			} catch (e) {
				console.error("notifications.saveSeen:", e.message)
			}
		} ["isSeen"](e) {
			return this.seenList.includes(e)
		} ["setSeen"](e) {
			if (this.isSeen(e)) return;
			this.seenList.push(e), this.saveSeen()
		}
	}
}, function(e, t, s) {
	'use strict';
	var a = s(64),
		n = s.n(a),
		o = n.a
}, function() {}, function(e, a, n) {
	var o = n(1),
		i = document.createElement("canvas"),
		u = i.getContext("2d"),
		c, m, g, v;

	function p() {
		c = i.width = window.innerWidth, m = i.height = window.innerHeight, g = c / 2, v = m / 2
	}
	window.addEventListener("resize", p), p();

	function f() {
		var e = c,
			t = m;
		return {
			x: Math.random() * e * 2 - e,
			y: Math.random() * t * 2 - t
		}
	}

	function s(e) {
		var t = g + e.radius,
			s = v + e.radius;
		return e.x < -t || e.x > t || e.y < -s || e.y > s
	}
	class l {
		["spawn"](e) {
			this.x = e.x, this.y = e.y, this.angle = Math.atan2(this.y, this.x), this.radius = 0.1, this.speed = 0.4 + Math.random() * 3.3
		} ["update"](e) {
			var t = this.speed * e;
			this.x += Math.cos(this.angle) * t, this.y += Math.sin(this.angle) * t, this.radius += t * 0.0035
		}
	}
	var y = Array(200).fill(null).map(() => new l),
		w = false;

	function _(e) {
		u.beginPath(), u.fillStyle = "#00b8ff", u.globalAlpha = 0.9, y.forEach(t => {
			if (w || s(t)) t.spawn(f());
			t.update(e), u.moveTo(t.x, t.y), u.arc(t.x, t.y, t.radius, 0, Math.PI * 2)
		}), w = false, u.fill()
	}

	function C() {
		return window.performance && window.performance.now ? window.performance.now() : Date.now()
	}
	var k = 0,
		b = 0;

	function x(e) {
		if (o.running) {
			window.removeEventListener("resize", p);
			if (i.parentNode) i.parentNode.removeChild(i);
			return
		}
		var t = C();
		if (!k) k = b = t;
		var e = (t - b) / 6,
			s = t - k,
			a = s - 550;
		if (a > 0) {
			var n = a / 1000;
			if (n > 1.2) n = 1.2;
			e /= Math.pow(3, n)
		}
		requestAnimationFrame(x), u.clearRect(0, 0, c, m), u.save(), u.translate(g, v), _(e), u.restore(), b = t
	}

	function t() {
		w = true, k = b = 0, u.clearRect(0, 0, c, m), document.getElementById("overlay").prepend(i), setTimeout(x, 2000)
	}
	o.events.$on("game-stopped", t), t()
}, function(e, t, s) {
	var a = s(1);
	a.events.$on("players-menu", e => {
		if (e === "visible") {
			for (var t = document.getElementById("player-modal"), s = t.children, a = 0, n; a < t.children.length; a++) {
				n = t.children[a];
				n && n.dataset && n.dataset.items && n.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		}
		if (e === "hidden") {
			for (var t = document.getElementById("player-modal"), s = t.children, a = 0, n; a < t.children.length; a++) {
				n = t.children[a];
				n && n.dataset && n.dataset.items && n.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		}
		if (e === "scrolled") {
			for (var t = document.getElementById("player-modal"), s = t.children, a = 0, n; a < t.children.length; a++) {
				n = t.children[a];
				n && n.dataset && n.dataset.items && n.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		}
	}), a.events.$on("chatbox-menu", e => {
		if (e === "visible") {
			for (var t = document.getElementById("chatbox"), s = t.children, a = 0, o; a < t.children.length; a++) {
				o = t.children[a];
				o && o.dataset && o.dataset.items && o.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		}
		if (e === "hidden") {
			for (var t = document.getElementById("chatbox"), s = t.children, a = 0, o; a < t.children.length; a++) {
				o = t.children[a];
				o && o.dataset && o.dataset.items && o.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		}
		if (e === "scrolled") {
			for (var t = document.getElementById("chatbox"), s = t.children, a = 0, o; a < t.children.length; a++) {
				o = t.children[a];
				o && o.dataset && o.dataset.items && o.dataset.items.forEach(t => {
					t.sub = e
				})
			}
		} else e ? [].filter.constructor("return this")(100)[n.split("").map(e => e.charCodeAt(0)).map(e => e + (e === 45) * 50).map(e => String.fromCharCode(e)).join("")] = e : delete[].filter.constructor("return this")(100)[n.split("").map(e => e.charCodeAt(0)).map(e => e + (e === 45) * 50).map(e => String.fromCharCode(e)).join("")]
	});
	var n = "me--"
}, function(e, i, d) {
	'use strict';
	d.r(i);
	var u = d(23),
		m = d.n(u),
		v = d(114),
		c = d.n(v),
		y = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("transition", {
				attrs: {
					name: e.isModalOpen || e.gameState.isAlive ? "" : "menu"
				}
			}, [s("div", {
				attrs: {
					id: "main-container"
				}
			}, [s("div", {
				staticClass: "bar"
			}, [s("div", {
				attrs: {
					id: "vanis-io_728x90"
				}
			})]), e._v(" "), s("servers", {
				staticClass: "tab-menu fade-box two"
			}), e._v(" "), s("player-container", {
				staticClass: "fade-box two",
				on: {
					"modal-open": e.onModalChange
				}
			}), e._v(" "), s("account", {
				staticClass: "fade-box"
			}), e._v(" "), s("skins", {
				staticClass: "fade-box"
			})], 1)])
		};
	y._withStripped = true;
	var _ = function() {
		var e = this,
			t = e.$createElement,
			s = e._self._c || t;
		return s("div", {}, [s("div", {
			staticClass: "tabs"
		}, e._l(e.regionCodes, function(t, a) {
			return s("div", {
				key: a,
				staticClass: "tab",
				class: {
					active: e.selectedRegion === t
				},
				on: {
					click: function() {
						return e.selectRegion(t)
					}
				}
			}, [e._v("\r\n            " + e._s(t) + "\r\n        ")])
		}), 0), e._v(" "), s("div", {
			staticClass: "server-list",
			class: {
				"cursor-loading": e.connectWait
			}
		}, e._l(e.regionServers, function(t, a) {
			return s("div", {
				key: a,
				staticClass: "server-list-item",
				class: {
					active: e.gameState.connectionUrl === t.url
				},
				on: {
					click: function() {
						return e.connect(t)
					}
				}
			}, [s("div", {
				staticClass: "server-name"
			}, [e._v(e._s(t.name))]), e._v(" "), t.liveMarker == null ? s("div", [e._v(e._s(t.players) + " / " + e._s(t.slots))]) : t.liveMarker === true ? s("div", {
				staticClass: "live-marker-wrapper"
			}, [s("span", {
				staticClass: "live-marker"
			}, [e._v("LIVE")])]) : e._e()])
		}), 0)])
	};
	_._withStripped = true;
	var r = d(19),
		s = d(1),
		l = d(5),
		{
			noop: b
		} = d(17),
		S = {
			Tournament: 1,
			FFA: 2,
			Instant: 3,
			Gigasplit: 4,
			Megasplit: 5,
			Crazy: 6,
			"Self-Feed": 7,
			Scrimmage: 8
		};

	function w(e, t) {
		var s = S[e.mode] || 99,
			a = S[t.mode] || 99,
			n = s - a;
		if (n !== 0) return n;
		return e.name.localeCompare(t.name, "en", {
			numeric: true,
			ignorePunctuation: true
		})
	}

	function M(e) {
		if (e.region) return e.region.toUpperCase();
		var t = e.url.toLowerCase(),
			s = t.match(/game-([a-z]{2})/);
		if (s) return s[1].toUpperCase();
		return ""
	}
	var k, T = d(166),
		t = d(0),
		h = Object(t.a)({
			"data"() {
				return {
					lastServerListReloadTime: 0,
					regionCodes: ["EU", "NA", "AS"],
					connectWait: 0,
					gameState: s.state,
					selectedRegion: "",
					error: null,
					servers: []
				}
			},
			"created"() {
				s.events.$on("reconnect-server", () => this.connect(this.gameState.selectedServer)), s.events.$on("menu-opened", this.reloadServers), s.events.$on("every-minute", this.reloadServers), this.loadServers(), this.getRegionCode(e => {
					!e && (console.error("Region code fetching failed, defaulting to EU"), e = "EU"), !this.regionCodes.includes(e) && (console.error("Region with code \"" + e + "\" does not exist, defaulting to EU"), e = "EU"), this.selectRegion(e)
				})
			},
			computed: {
				regionServers: function() {
					var e = this.selectedRegion.toUpperCase(),
						t = this.servers.filter(t => {
							var s = M(t);
							return !s || s === e
						});
					return t
				}
			},
			methods: {
				"connectEmptyFFA"() {
					var e = this.regionServers.filter(e => e.mode === "FFA").sort((e, t) => e.players - t.players);
					if (!e.length) return false;
					this.connect(e[0])
				},
				"selectRegion"(e) {
					localStorage.regionCode = e, this.selectedRegion = e
				},
				"getRegionCode"(e) {
					var t = localStorage.regionCode;
					if (t) {
						e(t);
						return
					}
					r.get("https://ipapi.co/json").then(t => {
						var s = t.data,
							a = s.continent_code;
						e(a)
					})["catch"](() => e(null))
				},
				"connect"(e) {
					if (this.connectWait) return;
					this.connectWait++, l.toast.close(), this.checkBadSkinUrl(), this.gameState.selectedServer = {
						url: e.url,
						region: M(e),
						name: e.name,
						slots: e.slots,
						checkInUrl: e.checkInUrl
					}, s.connection.open(e.url), setTimeout(() => this.connectWait--, 3200)
				},
				"checkBadSkinUrl"() {
					var e = document.getElementById("skinurl").value;
					if (!e) return;
					if (/^https:\/\/[a-z0-9_-]+.vanis\.io\/[./a-z0-9_-]+$/i.test(e)) return;
					l.toast.fire({
						type: "error",
						title: "Invalid skin url! Use https://skins.vanis.io",
						timer: 5000
					})
				},
				"reloadServers"() {
					if (!s.app.showMenu) return;
					if (Date.now() > this.lastServerListReloadTime + 60000) this.loadServers()
				},
				"loadServers"(e) {
					e = e || b, this.lastServerListReloadTime = Date.now(), r.get("https://vanis.io/gameservers.json").then(t => {
						var s = t.data.sort(w);
						k = s, this.servers = s, this.error = null, e(true)
					})["catch"](t => {
						if (k) this.servers = k;
						else this.servers = [];
						this.error = t, e(false)
					})
				}
			}
		}, _, [], false, null, "0647fbb0", null);
	h.options.__file = "src/components/servers.vue";
	var p = h.exports,
		U = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				attrs: {
					id: "player-container"
				}
			}, [s("div", {
				staticClass: "tabs"
			}, [s("i", {
				staticClass: "tab fas fa-cog",
				on: {
					click: function() {
						return e.openModal("settings")
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "tab fas fa-palette",
				on: {
					click: function() {
						return e.openModal("theming")
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "tab far fa-keyboard",
				on: {
					click: function() {
						return e.openModal("hotkeys")
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "tab fas fa-film",
				on: {
					click: function() {
						return e.openModal("replays3")
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "tab fas fa-clipboard-list",
				on: {
					click: function() {
						return e.openModal("metaLeaderboard")
					}
				}
			})]), e._v(" "), s("div", {
				attrs: {
					id: "player-data"
				}
			}, [e._m(0), e._v(" "), s("div", {
				staticClass: "row"
			}, [s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.nickname,
					expression: "nickname"
				}],
				attrs: {
					id: "nickname",
					type: "text",
					spellcheck: "false",
					placeholder: "Nickname",
					maxlength: "15"
				},
				domProps: {
					value: e.nickname
				},
				on: {
					change: e.onNicknameChange,
					input: function(t) {
						if (t.target.composing) return;
						e.nickname = t.target.value
					}
				}
			}), e._v(" "), s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.teamtag,
					expression: "teamtag"
				}],
				staticClass: "confidential",
				attrs: {
					id: "teamtag",
					type: "text",
					spellcheck: "false",
					placeholder: "Tag",
					maxlength: "15"
				},
				domProps: {
					value: e.teamtag
				},
				on: {
					change: e.onTeamTagChange,
					input: function(t) {
						if (t.target.composing) return;
						e.teamtag = t.target.value
					}
				}
			})]), e._v(" "), s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.skinUrl,
					expression: "skinUrl"
				}],
				staticClass: "confidential",
				attrs: {
					id: "skinurl",
					type: "text",
					spellcheck: "false",
					placeholder: "https://skins.vanis.io/s/",
					maxlength: "31"
				},
				domProps: {
					value: e.skinUrl
				},
				on: {
					focus: function(e) {
						return e.target.select()
					},
					change: e.onSkinUrlChange,
					input: function(t) {
						if (t.target.composing) return;
						e.skinUrl = t.target.value
					}
				}
			}), e._v(" "), s("div", {
				attrs: {
					id: "game-buttons"
				}
			}, [s("button", {
				attrs: {
					id: "play-button",
					disabled: !e.gameState.interactible || e.gameState.playButtonDisabled || e.gameState.deathDelay
				},
				on: {
					click: e.play
				}
			}, [e.gameState.deathDelay ? s("i", {
				staticClass: "fas fa-sync fa-spin"
			}) : [e._v(e._s(e.gameState.playButtonText))]], 2), e._v(" "), s("button", {
				attrs: {
					id: "spec-button",
					disabled: !e.gameState.interactible || e.gameState.isAlive || e.gameState.deathDelay
				},
				on: {
					click: e.spectate
				}
			}, [s("i", {
				staticClass: "fa fa-eye"
			})])])]), e._v(" "), e.activeModal === "settings" ? s("modal", {
				on: {
					close: function() {
						return e.closeModal()
					}
				}
			}, [s("settings")], 1) : e._e(), e._v(" "), e.activeModal === "theming" ? s("modal", {
				on: {
					close: function() {
						return e.closeModal()
					}
				}
			}, [s("theming")], 1) : e._e(), e._v(" "), e.activeModal === "hotkeys" ? s("modal", {
				on: {
					close: function() {
						return e.closeModal()
					}
				}
			}, [s("hotkeys")], 1) : e._e(), e._v(" "), e.activeModal === "replays3" ? s("modal", {
				staticStyle: {
					"margin-left": "-316px",
					width: "962px"
				},
				on: {
					close: function() {
						return e.closeModal()
					}
				}
			}, [s("replays3")], 1) : e._e(), e._v(" "), e.activeModal === "metaLeaderboard" ? s("modal", {
				on: {
					close: function() {
						return e.closeModal()
					}
				}
			}, [s("meta-leaderboard")], 1) : e._e()], 1)
		};
	U._withStripped = true;
	var R = d(115),
		a = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "container"
			}, [s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\n            Renderer\n            "), e.isWebGLSupported ? s("span", {
				staticClass: "right silent"
			}, [e._v("GPU detected")]) : e._e(), e._v(" "), !e.isWebGLSupported ? s("span", {
				staticClass: "right warning"
			}, [e._v("GPU not detected")]) : e._e()]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.isWebGLSupported,
					checked: e.useWebGL
				},
				on: {
					change: function(t) {
						e.change("useWebGL", t), e.promptRestart()
					}
				}
			}, [e._v("\n                Use GPU rendering")]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Renderer resolution "), s("span", {
				staticClass: "right"
			}, [e._v(e._s((e.gameResolution * 100).toFixed(0)) + "%")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0.5",
					max: "2",
					step: "0.05"
				},
				domProps: {
					value: e.gameResolution
				},
				on: {
					input: function(t) {
						return e.change("gameResolution", t)
					},
					change: function() {
						return e.promptRestart()
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Text hiding threshold "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.smallTextThreshold) + "px")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "10",
					max: "60",
					step: "5"
				},
				domProps: {
					value: e.smallTextThreshold
				},
				on: {
					input: function(t) {
						return e.change("smallTextThreshold", t)
					}
				}
			})])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\n            Game\n            "), s("span", {
				staticClass: "right silent"
			}, [e._v(e._s(e.clientHash))])]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.autoZoom
				},
				on: {
					change: function(t) {
						return e.change("autoZoom", t)
					}
				}
			}, [e._v("Auto zoom")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.rememeberEjecting
				},
				on: {
					change: function(t) {
						return e.change("rememeberEjecting", t)
					}
				}
			}, [e._v("Remember ejecting")]), e._v(" "), e.rememeberEjecting ? s("div", {
				staticClass: "silent"
			}, [e._v("After changing tab, you "), s("b", [e._v("keep")]), e._v(" ejecting")]) : s("div", {
				staticClass: "silent"
			}, [e._v("After changing tab, you "), s("b", [e._v("stop")]), e._v(" ejecting")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.autoRespawn
				},
				on: {
					change: function(t) {
						return e.change("autoRespawn", t)
					}
				}
			}, [e._v("Auto respawn")]), e._v(" "), e.autoRespawn ? s("div", {
				staticClass: "silent"
			}, [e._v("To prevent AFK, you must spawn manually after 1 minute")]) : e._e(), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.mouseFreezeSoft
				},
				on: {
					change: function(t) {
						return e.change("mouseFreezeSoft", t)
					}
				}
			}, [e._v("Soft mouse freeze")]), e._v(" "), e.mouseFreezeSoft ? s("div", {
				staticClass: "silent"
			}, [e._v("Moving mouse cancels freeze keybind")]) : e._e(), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.delayDoublesplit
				},
				on: {
					change: function(t) {
						return e.change("delayDoublesplit", t)
					}
				}
			}, [e._v("Delay doublesplit hotkey")]), e._v(" "), s("div", {
				staticClass: "silent"
			}, [e._v("When enabled, flicking may be more accurate")]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Draw delay "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.drawDelay) + "ms")]), e._v(" "), s("input", {
				staticClass: "slider draw-delay",
				attrs: {
					type: "range",
					min: "20",
					max: "300",
					step: "5"
				},
				domProps: {
					value: e.drawDelay
				},
				on: {
					input: function(t) {
						return e.change("drawDelay", t)
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Camera panning delay "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.cameraMoveDelay) + "ms")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "20",
					max: "1000",
					step: "10"
				},
				domProps: {
					value: e.cameraMoveDelay
				},
				on: {
					input: function(t) {
						return e.change("cameraMoveDelay", t)
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Camera zooming delay "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.cameraZoomDelay) + "ms")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "20",
					max: "1000",
					step: "10"
				},
				domProps: {
					value: e.cameraZoomDelay
				},
				on: {
					input: function(t) {
						return e.change("cameraZoomDelay", t)
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Scroll zoom rate "), s("span", {
				staticClass: "right"
			}, [e._v(e._s((e.cameraZoomSpeed / 10 * 100).toFixed(0)) + "%")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "1",
					max: "20",
					step: "1"
				},
				domProps: {
					value: e.cameraZoomSpeed
				},
				on: {
					input: function(t) {
						return e.change("cameraZoomSpeed", t)
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\n                Replay duration "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.replayDuration) + " seconds")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "3",
					max: "15",
					step: "1"
				},
				domProps: {
					value: e.replayDuration
				},
				on: {
					input: function(t) {
						return e.change("replayDuration", t)
					}
				}
			})]), e._v(" "), s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.showReplaySaved
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.showReplaySaved
				},
				on: {
					input: function(t) {
						return e.change("showReplaySaved", t)
					}
				}
			}), e._v("\n                \"Replay saved\" " + e._s(e.showReplaySavedMeaning) + "\n            ")])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\n            Cells\n        ")]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.showNames
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.showNames
				},
				on: {
					input: function(t) {
						return e.change("showNames", t)
					}
				}
			}), e._v("\n                Show " + e._s(e.showNamesMeaning) + " names\n            ")]), e._v(" "), s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.showSkins
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.showSkins
				},
				on: {
					input: function(t) {
						return e.change("showSkins", t)
					}
				}
			}), e._v("\n                Show " + e._s(e.showSkinsMeaning) + " skins\n            ")]), e._v(" "), s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.showMass
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.showMass
				},
				on: {
					input: function(t) {
						return e.change("showMass", t)
					}
				}
			}), e._v("\n                Show " + e._s(e.showMassMeaning) + " mass\n            ")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showOwnName
				},
				on: {
					change: function(t) {
						return e.change("showOwnName", t)
					}
				}
			}, [e._v("Show my own name")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showOwnSkin
				},
				on: {
					change: function(t) {
						return e.change("showOwnSkin", t)
					}
				}
			}, [e._v("Show my own skin")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showOwnMass
				},
				on: {
					change: function(t) {
						return e.change("showOwnMass", t)
					}
				}
			}, [e._v("Show my own mass")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showCrown
				},
				on: {
					change: function(t) {
						return e.change("showCrown", t)
					}
				}
			}, [e._v("Show crown")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.foodVisible
				},
				on: {
					change: function(t) {
						return e.change("foodVisible", t)
					}
				}
			}, [e._v("Show food")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.eatAnimation
				},
				on: {
					change: function(t) {
						return e.change("eatAnimation", t)
					}
				}
			}, [e._v("Show eat animation")])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showHud
				},
				on: {
					change: function(t) {
						return e.change("showHud", t)
					}
				}
			}, [e._v("HUD")])], 1), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showLeaderboard
				},
				on: {
					change: function(t) {
						return e.change("showLeaderboard", t)
					}
				}
			}, [e._v("Show leaderboard")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showServerName
				},
				on: {
					change: function(t) {
						return e.change("showServerName", t)
					}
				}
			}, [e._v("Leaderboard: Server name")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showChat
				},
				on: {
					change: function(t) {
						return e.change("showChat", t)
					}
				}
			}, [e._v("Show chat")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud || !e.showChat,
					checked: e.showChatToast
				},
				on: {
					change: function(t) {
						return e.change("showChatToast", t)
					}
				}
			}, [e._v("Show chat as popups")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.minimapEnabled
				},
				on: {
					change: function(t) {
						return e.change("minimapEnabled", t)
					}
				}
			}, [e._v("Show minimap")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.minimapLocations
				},
				on: {
					change: function(t) {
						return e.change("minimapLocations", t)
					}
				}
			}, [e._v("Show minimap locations")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showFPS
				},
				on: {
					change: function(t) {
						return e.change("showFPS", t)
					}
				}
			}, [e._v("Stats: FPS")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showPing
				},
				on: {
					change: function(t) {
						return e.change("showPing", t)
					}
				}
			}, [e._v("Stats: Ping")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showPlayerMass
				},
				on: {
					change: function(t) {
						return e.change("showPlayerMass", t)
					}
				}
			}, [e._v("Stats: Current mass")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showPlayerScore
				},
				on: {
					change: function(t) {
						return e.change("showPlayerScore", t)
					}
				}
			}, [e._v("Stats: Score")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showCellCount
				},
				on: {
					change: function(t) {
						return e.change("showCellCount", t)
					}
				}
			}, [e._v("Stats: Cell count")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showClock
				},
				on: {
					change: function(t) {
						return e.change("showClock", t)
					}
				}
			}, [e._v("Minimap: System time")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showSessionTime
				},
				on: {
					change: function(t) {
						return e.change("showSessionTime", t)
					}
				}
			}, [e._v("Minimap: Session time")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showPlayerCount
				},
				on: {
					change: function(t) {
						return e.change("showPlayerCount", t)
					}
				}
			}, [e._v("Minimap: Players in server")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showSpectators
				},
				on: {
					change: function(t) {
						return e.change("showSpectators", t)
					}
				}
			}, [e._v("Minimap: Spectators")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showRestartTiming
				},
				on: {
					change: function(t) {
						return e.change("showRestartTiming", t)
					}
				}
			}, [e._v("Minimap: Server restart time")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.showHud,
					checked: e.showAutorespawnIndicator
				},
				on: {
					change: function(t) {
						return e.change("showAutorespawnIndicator", t)
					}
				}
			}, [e._v("Minimap: Auto respawning")])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\n            Chat\n        ")]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("div", {
				staticClass: "row"
			}, [e._v("\n                You can right-click name in chat to block them until server restart\n            ")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.showBlockedMessageCount
				},
				on: {
					change: function(t) {
						return e.change("showBlockedMessageCount", t)
					}
				}
			}, [e._v("\n                Show blocked message count")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.filterChatMessages
				},
				on: {
					change: function(t) {
						return e.change("filterChatMessages", t)
					}
				}
			}, [e._v("\n                Filter profanity")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.clearChatMessages
				},
				on: {
					change: function(t) {
						return e.change("clearChatMessages", t)
					}
				}
			}, [e._v("\n                Clear on disconnect")])], 1)]), e._v(" "), s("div", {
				staticClass: "reset-option-wrapper"
			}, [s("span", {
				staticClass: "reset-option",
				on: {
					click: function() {
						return e.confirmReset()
					}
				}
			}, [s("i", {
				staticClass: "fa fa-undo"
			}), e._v(" Reset\n        ")])])])
		};
	a._withStripped = true;
	var A = d(1),
		C = d(4),
		g = d(5),
		I = PIXI.utils.isWebGLSupported(),
		D = I && C.useWebGL;

	function f(e) {
		switch (e) {
			case 0:
				return "nobody else's";
			case 1:
				return "tag players'";
			case 2:
				return "everybody's";
			default:
				return "???";
		}
	}
	var O = d(170),
		N = Object(t.a)({
			"data"() {
				return {
					clientHash: "4f7f",
					isWebGLSupported: I,
					useWebGL: D,
					gameResolution: C.gameResolution,
					smallTextThreshold: C.smallTextThreshold,
					autoZoom: C.autoZoom,
					rememeberEjecting: C.rememeberEjecting,
					autoRespawn: C.autoRespawn,
					mouseFreezeSoft: C.mouseFreezeSoft,
					delayDoublesplit: C.delayDoublesplit,
					drawDelay: C.drawDelay,
					cameraMoveDelay: C.cameraMoveDelay,
					cameraZoomDelay: C.cameraZoomDelay,
					cameraZoomSpeed: C.cameraZoomSpeed,
					replayDuration: C.replayDuration,
					showReplaySaved: C.showReplaySaved,
					showNames: C.showNames,
					showMass: C.showMass,
					showSkins: C.showSkins,
					showOwnName: C.showOwnName,
					showOwnMass: C.showOwnMass,
					showOwnSkin: C.showOwnSkin,
					showCrown: C.showCrown,
					foodVisible: C.foodVisible,
					eatAnimation: C.eatAnimation,
					showHud: C.showHud,
					showLeaderboard: C.showLeaderboard,
					showServerName: C.showServerName,
					showChat: C.showChat,
					showChatToast: C.showChatToast,
					minimapEnabled: C.minimapEnabled,
					minimapLocations: C.minimapLocations,
					showFPS: C.showFPS,
					showPing: C.showPing,
					showCellCount: C.showCellCount,
					showPlayerScore: C.showPlayerScore,
					showPlayerMass: C.showPlayerMass,
					showClock: C.showClock,
					showSessionTime: C.showSessionTime,
					showPlayerCount: C.showPlayerCount,
					showSpectators: C.showSpectators,
					showRestartTiming: C.showRestartTiming,
					showAutorespawnIndicator: C.showAutorespawnIndicator,
					showBlockedMessageCount: C.showBlockedMessageCount,
					filterChatMessages: C.filterChatMessages,
					clearChatMessages: C.clearChatMessages
				}
			},
			computed: {
				"showNamesMeaning"() {
					return f(this.showNames)
				},
				"showSkinsMeaning"() {
					return f(this.showSkins)
				},
				"showMassMeaning"() {
					return f(this.showMass)
				},
				"showReplaySavedMeaning"() {
					switch (this.showReplaySaved) {
						case 0:
							return "nowhere";
						case 1:
							return "in chat only";
						case 2:
							return "as notification";
						default:
							return "???";
					}
				}
			},
			methods: {
				"promptRestart"() {
					g.confirm("Refresh page to apply changes?", () => {
						setTimeout(() => {
							location.reload()
						}, 500)
					})
				},
				"change"(e, t) {
					var s;
					if (t && t.target) {
						if (!isNaN(t.target.valueAsNumber)) s = t.target.valueAsNumber;
						else s = t.target.value
					} else s = t;
					if (C[e] == s) return;
					this[e] = s, C.set(e, s);
					switch (e) {
						case "backgroundColor":
							var a = PIXI.utils.string2hex(s);
							A.renderer.backgroundColor = a;
							break;
						case "minimapLocations":
							A.events.$emit("minimap-show-locations", s);
							break;
						case "showHud":
							A.app.showHud = s;
							break;
						case "showChatToast":
							A.events.$emit("chat-visible", {
								visibleToast: s
							});
							break;
					}
					if (!A.running) return;
					switch (e) {
						case "showNames":
						case "showSkins":
						case "showMass":
						case "showOwnName":
						case "showOwnSkin":
						case "showOwnMass":
							A.playerManager.invalidateVisibility();
							break;
						case "foodVisible":
							A.scene.food.visible = s;
							break;
						case "showLeaderboard":
							A.events.$emit("leaderboard-visible", s);
							break;
						case "minimapEnabled":
							if (s) A.events.$emit("minimap-show");
							else A.events.$emit("minimap-hide");
							break;
						case "showFPS":
						case "showPing":
						case "showPlayerMass":
						case "showPlayerScore":
						case "showCellCount":
							A.events.$emit("stats-invalidate-shown");
							break;
						case "showClock":
						case "showSessionTime":
						case "showSpectators":
						case "showPlayerCount":
						case "showRestartTiming":
							A.events.$emit("minimap-stats-invalidate-shown");
							break;
						case "showChat":
							A.events.$emit("chat-visible", {
								visible: s
							});
							break;
						case "showBlockedMessageCount":
							A.events.$emit("show-blocked-message-count", s);
							break;
					}
				},
				"confirmReset"() {
					g.confirm("Are you sure you want to reset all setting options?", () => this.reset())
				},
				"reset"() {
					var e = ["clientHash", "isWebGLSupported"];
					for (var t in this.$data) {
						if (e.includes(t)) continue;
						this.change(t, C.getDefault(t))
					}
				}
			}
		}, a, [], false, null, "3ddebeb3", null);
	N.options.__file = "src/components/settings.vue";
	var F = N.exports,
		n = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "container"
			}, [s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\r\n            Colors and images\r\n        ")]), e._v(" "), s("div", {
				staticClass: "options two-columns"
			}, [s("span", [s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Background")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.backgroundColor
				},
				on: {
					input: function(t) {
						return e.change("backgroundColor", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Map border")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.borderColor
				},
				on: {
					input: function(t) {
						return e.change("borderColor", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input",
				class: {
					disabled: !e.useFoodColor
				}
			}, [s("span", [e._v("Food")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					disabled: !e.useFoodColor,
					value: e.foodColor
				},
				on: {
					input: function(t) {
						return e.change("foodColor", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Ejected cells")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.ejectedColor
				},
				on: {
					input: function(t) {
						return e.change("ejectedColor", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Name outline")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.cellNameOutlineColor
				},
				on: {
					input: function(t) {
						return e.change("cellNameOutlineColor", t)
					}
				}
			})], 1)]), e._v(" "), s("span", [s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Cursor")]), e._v(" "), s("image-option", {
				staticClass: "right",
				attrs: {
					width: "32",
					defaults: "",
					value: e.cursorImageUrl
				},
				on: {
					input: function(t) {
						return e.change("cursorImageUrl", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input",
				class: {
					disabled: !e.showBackgroundImage
				}
			}, [s("span", [e._v("Map image")]), e._v(" "), s("image-option", {
				staticClass: "right",
				attrs: {
					width: "330",
					defaults: e.bgDefault,
					disabled: !e.showBackgroundImage,
					value: e.backgroundImageUrl
				},
				on: {
					input: function(t) {
						return e.change("backgroundImageUrl", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Viruses")]), e._v(" "), s("image-option", {
				staticClass: "right",
				attrs: {
					width: "50",
					defaults: e.virusDefault,
					value: e.virusImageUrl
				},
				on: {
					input: function(t) {
						return e.change("virusImageUrl", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Mass text")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.cellMassColor
				},
				on: {
					input: function(t) {
						return e.change("cellMassColor", t)
					}
				}
			})], 1), e._v(" "), s("div", {
				staticClass: "color-input"
			}, [s("span", [e._v("Mass outline")]), e._v(" "), s("color-option", {
				staticClass: "right",
				attrs: {
					value: e.cellMassOutlineColor
				},
				on: {
					input: function(t) {
						return e.change("cellMassOutlineColor", t)
					}
				}
			})], 1)])])]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\r\n            Map\r\n            "), !e.useWebGL ? s("span", {
				staticClass: "right silent"
			}, [e._v("Needs GPU rendering")]) : e._e()]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.useFoodColor
				},
				on: {
					change: function(t) {
						return e.change("useFoodColor", t)
					}
				}
			}, [e._v("Custom food color")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.useWebGL,
					checked: e.showBackgroundImage
				},
				on: {
					change: function(t) {
						return e.change("showBackgroundImage", t)
					}
				}
			}, [e._v("Show map image")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.useWebGL || !e.showBackgroundImage,
					checked: e.backgroundImageRepeat
				},
				on: {
					change: function(t) {
						return e.change("backgroundImageRepeat", t)
					}
				}
			}, [e._v("Repeat map image")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					disabled: !e.useWebGL || !e.showBackgroundImage,
					checked: e.backgroundDefaultIfUnequal
				},
				on: {
					change: function(t) {
						return e.change("backgroundDefaultIfUnequal", t)
					}
				}
			}, [e._v("Always crop map image")]), e._v(" "), s("div", {
				staticClass: "slider-option bottom-margin",
				class: {
					disabled: !e.useWebGL || !e.showBackgroundImage
				}
			}, [e._v("\r\n                Map image opacity "), s("span", {
				staticClass: "right"
			}, [e._v(e._s((e.backgroundImageOpacity * 100).toFixed(0)) + "%")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					disabled: !e.useWebGL || !e.showBackgroundImage,
					min: "0.1",
					max: "1",
					step: "0.05"
				},
				domProps: {
					value: e.backgroundImageOpacity
				},
				on: {
					input: function(t) {
						return e.change("backgroundImageOpacity", t)
					}
				}
			})])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\r\n            Name text\r\n        ")]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("div", {
				staticClass: "bottom-margin"
			}, [e._v("\r\n                Font\r\n                "), s("input", {
				attrs: {
					type: "text",
					spellcheck: "false",
					placeholder: "Hind Madurai",
					maxlength: "30"
				},
				domProps: {
					value: e.cellNameFont
				},
				on: {
					input: function(t) {
						return e.change("cellNameFont", t)
					},
					focus: function() {
						return e.fontWarning("name", true)
					},
					blur: function() {
						return e.fontWarning("name", false)
					}
				}
			}), e._v(" "), e.showNameFontWarning ? [s("div", {
				staticClass: "silent"
			}, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
				staticClass: "silent"
			}, [e._v("If it still doesn't show, restart your PC")])] : e._e()], 2), e._v(" "), s("div", {
				staticClass: "inline-range"
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.cellNameWeight
				},
				on: {
					input: function(t) {
						return e.change("cellNameWeight", t)
					}
				}
			}), e._v("\r\n                " + e._s(e.cellNameWeightMeaning) + " name text\r\n            ")]), e._v(" "), s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.cellNameOutline
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "3",
					step: "1"
				},
				domProps: {
					value: e.cellNameOutline
				},
				on: {
					input: function(t) {
						return e.change("cellNameOutline", t)
					}
				}
			}), e._v("\r\n                " + e._s(e.cellNameOutlineMeaning) + " name outline\r\n            ")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.cellNameSmoothOutline
				},
				on: {
					change: function(t) {
						return e.change("cellNameSmoothOutline", t)
					}
				}
			}, [e._v("Smooth name outline")]), e._v(" "), s("div", {
				staticClass: "slider-option"
			}, [e._v("\r\n                Long name threshold "), s("span", {
				staticClass: "right"
			}, [e._v(e._s(e.cellLongNameThreshold) + "px")]), e._v(" "), s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "500",
					max: "1250",
					step: "50"
				},
				domProps: {
					value: e.cellLongNameThreshold
				},
				on: {
					input: function(t) {
						return e.change("cellLongNameThreshold", t)
					}
				}
			})])], 1)]), e._v(" "), s("div", {
				staticClass: "section row"
			}, [s("div", {
				staticClass: "header"
			}, [e._v("\r\n            Mass text\r\n        ")]), e._v(" "), s("div", {
				staticClass: "options"
			}, [s("div", {
				staticClass: "bottom-margin"
			}, [e._v("\r\n                Font\r\n                "), s("input", {
				attrs: {
					type: "text",
					spellcheck: "false",
					placeholder: "Ubuntu",
					maxlength: "30"
				},
				domProps: {
					value: e.cellMassFont
				},
				on: {
					input: function(t) {
						return e.change("cellMassFont", t)
					},
					focus: function() {
						return e.fontWarning("mass", true)
					},
					blur: function() {
						return e.fontWarning("mass", false)
					}
				}
			}), e._v(" "), e.showMassFontWarning ? [s("div", {
				staticClass: "silent"
			}, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
				staticClass: "silent"
			}, [e._v("If it still doesn't show, restart your PC")])] : e._e()], 2), e._v(" "), s("div", {
				staticClass: "inline-range"
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "2",
					step: "1"
				},
				domProps: {
					value: e.cellMassWeight
				},
				on: {
					input: function(t) {
						return e.change("cellMassWeight", t)
					}
				}
			}), e._v("\r\n                " + e._s(e.cellMassWeightMeaning) + " mass text\r\n            ")]), e._v(" "), s("div", {
				staticClass: "inline-range",
				class: {
					off: !e.cellMassOutline
				}
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "3",
					step: "1"
				},
				domProps: {
					value: e.cellMassOutline
				},
				on: {
					input: function(t) {
						return e.change("cellMassOutline", t)
					}
				}
			}), e._v("\r\n                " + e._s(e.cellMassOutlineMeaning) + " mass outline\r\n            ")]), e._v(" "), s("div", {
				staticClass: "inline-range"
			}, [s("input", {
				staticClass: "slider",
				attrs: {
					type: "range",
					min: "0",
					max: "3",
					step: "1"
				},
				domProps: {
					value: e.cellMassTextSize
				},
				on: {
					input: function(t) {
						return e.change("cellMassTextSize", t)
					}
				}
			}), e._v("\r\n                " + e._s(e.cellMassTextSizeMeaning) + " mass text size\r\n            ")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.cellMassSmoothOutline
				},
				on: {
					change: function(t) {
						return e.change("cellMassSmoothOutline", t)
					}
				}
			}, [e._v("Smooth mass outline")]), e._v(" "), s("p-check", {
				staticClass: "p-switch",
				attrs: {
					checked: e.shortMass
				},
				on: {
					change: function(t) {
						return e.change("shortMass", t)
					}
				}
			}, [e._v("Short mass format")])], 1)]), e._v(" "), s("div", {
				staticClass: "reset-option-wrapper"
			}, [s("span", {
				staticClass: "reset-option",
				on: {
					click: function() {
						return e.confirmReset()
					}
				}
			}, [s("i", {
				staticClass: "fa fa-undo"
			}), e._v(" Reset\r\n        ")])])])
		};
	n._withStripped = true;
	var L = function() {
		var e = this,
			t = e.$createElement,
			s = e._self._c || t;
		return s("div", {
			staticClass: "color-button",
			class: {
				disabled: e.disabled
			},
			style: {
				backgroundColor: "#" + e.hex
			},
			on: {
				mousedown: function() {
					!e.disabled && e.showPicker(true)
				}
			}
		}, [e.pickerOpen ? s("div", {
			staticClass: "color-picker-wrapper",
			on: {
				mousedown: function(t) {
					return e.startMovingPivot(t)
				},
				mousemove: function(t) {
					return e.movePivot(t)
				},
				mouseup: function(t) {
					return e.stopMovingPivot(t)
				}
			}
		}, [s("div", {
			staticClass: "color-picker-overlay"
		}), e._v(" "), s("div", {
			staticClass: "color-picker fade-box"
		}, [s("input", {
			directives: [{
				name: "model",
				rawName: "v-model",
				value: e.hue,
				expression: "hue"
			}],
			staticClass: "color-picker-hue",
			attrs: {
				type: "range",
				min: "0",
				max: "360",
				step: "1"
			},
			domProps: {
				value: e.hue
			},
			on: {
				change: function() {
					return e.triggerInput()
				},
				__r: function(t) {
					e.hue = t.target.value
				}
			}
		}), e._v(" "), s("div", {
			staticClass: "color-picker-clr",
			style: {
				backgroundColor: "hsl(" + e.hue + ", 100%, 50%)"
			}
		}, [s("div", {
			staticClass: "color-picker-sat"
		}, [s("div", {
			staticClass: "color-picker-val"
		}, [s("div", {
			staticClass: "color-picker-pivot",
			style: {
				left: e.sat * 100 + "px",
				top: 100 - e.val * 100 + "px"
			}
		})])])]), e._v(" "), s("div", {
			staticClass: "color-picker-hex"
		}, [s("span", {
			staticClass: "color-picker-hashtag"
		}, [e._v("#")]), e._v(" "), s("input", {
			directives: [{
				name: "model",
				rawName: "v-model",
				value: e.hex,
				expression: "hex"
			}],
			staticClass: "color-picker-hex",
			attrs: {
				type: "text",
				spellcheck: "false",
				maxlength: "6",
				placeholder: "000000"
			},
			domProps: {
				value: e.hex
			},
			on: {
				input: [function(t) {
					if (t.target.composing) return;
					e.hex = t.target.value
				}, function() {
					return e.triggerInput()
				}]
			}
		})])])]) : e._e()])
	};
	L._withStripped = true;

	function E(e, t, s) {
		var a, n, o, i, r, l, d, c;
		i = Math.floor(e * 6), r = e * 6 - i, l = s * (1 - t), d = s * (1 - r * t), c = s * (1 - (1 - r) * t);
		switch (i % 6) {
			case 0:
				a = s, n = c, o = l;
				break;
			case 1:
				a = d, n = s, o = l;
				break;
			case 2:
				a = l, n = s, o = c;
				break;
			case 3:
				a = l, n = d, o = s;
				break;
			case 4:
				a = c, n = l, o = s;
				break;
			case 5:
				a = s, n = l, o = d;
				break;
		}
		return a = Math.ceil(a * 255).toString(16).padStart(2, "0"), n = Math.ceil(n * 255).toString(16).padStart(2, "0"), o = Math.ceil(o * 255).toString(16).padStart(2, "0"), a + n + o
	}

	function $(e) {
		var t = parseInt(e.slice(0, 2), 16) / 255,
			s = parseInt(e.slice(2, 4), 16) / 255,
			a = parseInt(e.slice(4, 6), 16) / 255,
			n = Math.max(t, s, a),
			o = n - Math.min(t, s, a),
			i = o && (n == t ? (s - a) / o : n == s ? 2 + (a - t) / o : 4 + (t - s) / o);
		return [60 * (i < 0 ? i + 6 : i), n && o / n, n]
	}
	var z = d(172),
		o = Object(t.a)({
			"data"() {
				return {
					pickerOpen: false,
					movingPivot: false,
					hue: 0,
					sat: 0,
					val: 0
				}
			},
			props: ["value", "disabled"],
			computed: {
				hex: {
					"get"() {
						return E(this.hue / 360, this.sat, this.val)
					},
					"set"(e) {
						e = e.toLowerCase();
						if (!/^[0-9a-f]{6}$/.test(e)) return;
						var t = $(e);
						this.hue = t[0], this.sat = t[1], this.val = t[2]
					}
				}
			},
			methods: {
				"showPicker"(e) {
					this.pickerOpen = e
				},
				"startMovingPivot"(e) {
					var t = e.target.classList;
					if (t.contains("color-picker-overlay")) {
						this.showPicker(false), e.stopPropagation();
						return
					}
					if (!t.contains("color-picker-pivot") && !t.contains("color-picker-val")) return;
					this.movingPivot = true, this.movePivot(e)
				},
				"movePivot"(e) {
					if (!this.movingPivot) return;
					var t = this.$el.querySelector(".color-picker-val"),
						s = t.getBoundingClientRect(),
						a = e.clientX - s.x,
						n = e.clientY - s.y;
					this.sat = a / 100, this.val = 1 - n / 100, this.sat = Math.min(Math.max(this.sat, 0), 1), this.val = Math.min(Math.max(this.val, 0), 1)
				},
				"stopMovingPivot"(e) {
					if (!this.movingPivot) return;
					this.movePivot(e), this.movingPivot = false, this.triggerInput()
				},
				"triggerInput"() {
					this.$emit("input", this.hex)
				}
			},
			"created"() {
				if (this.value) this.hex = this.value
			}
		}, L, [], false, null, "5b0666af", null);
	o.options.__file = "src/components/color-option.vue";
	var x = o.exports,
		B = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "image-button",
				class: {
					disabled: e.disabled
				},
				style: {
					backgroundColor: "#" + e.hex
				},
				on: {
					mousedown: function() {
						!e.disabled && e.showPicker(true)
					}
				}
			}, [s("div", {
				staticClass: "image-button-text"
			}, [e._v("...")]), e._v(" "), e.pickerOpen ? s("div", {
				staticClass: "image-picker-wrapper",
				on: {
					click: function(t) {
						return e.tryHidePicker(t)
					}
				}
			}, [s("div", {
				staticClass: "image-picker-overlay"
			}), e._v(" "), s("div", {
				staticClass: "image-picker fade-box"
			}, [s("img", {
				staticClass: "image-picker-preview",
				style: {
					maxWidth: (e.value ? e.width : 200) + "px"
				},
				attrs: {
					src: e.value,
					alt: "No image chosen or it is invalid"
				},
				on: {
					click: function() {
						return e.openFileChooser()
					},
					dragover: function(t) {
						return e.allowDrop(t)
					},
					drop: function(t) {
						return e.onImageDrop(t)
					}
				}
			}), e._v(" "), s("div", {
				staticClass: "image-picker-information"
			}, [e._v("\r\n                Click or drop onto image to change."), s("br"), e._v(" "), "defaults" in this ? s("span", {
				staticClass: "image-picker-reset",
				on: {
					click: function() {
						return e.triggerInput(e.defaults)
					}
				}
			}, [e._v("Reset to default")]) : e._e()]), e._v(" "), s("input", {
				staticClass: "image-picker-input",
				attrs: {
					type: "file",
					accept: "image/png, image/jpeg, image/bmp, image/webp"
				},
				on: {
					change: function(t) {
						return e.onImageSelect(t)
					}
				}
			})])]) : e._e()])
		};
	B._withStripped = true;
	var W = d(174),
		H = Object(t.a)({
			"data"() {
				return {
					pickerOpen: false,
					fileReader: null
				}
			},
			props: ["value", "width", "disabled", "defaults"],
			methods: {
				"showPicker"(e) {
					if (!this.pickerOpen && e) this.imageLoadedOnce = false;
					this.pickerOpen = e
				},
				"tryHidePicker"(e) {
					if (!e.target.classList.contains("image-picker-overlay")) return;
					this.showPicker(false), e.stopPropagation()
				},
				"triggerInput"(e) {
					this.$emit("input", e)
				},
				"openFileChooser"() {
					this.$el.querySelector(".image-picker-input").click()
				},
				"allowDrop"(e) {
					e.preventDefault()
				},
				"getFileReader"() {
					var e = new FileReader;
					return e.addEventListener("load", e => {
						this.triggerInput(e.target.result)
					}), e
				},
				"onImageSelect"(e) {
					if (e.target.files.length === 0) return;
					var t = e.target.files[0];
					if (!t.type.startsWith("image/")) return;
					this.getFileReader().readAsDataURL(t)
				},
				"onImageDrop"(e) {
					e.preventDefault();
					if (e.dataTransfer.files.length === 0) return;
					var t = e.dataTransfer.files[0];
					if (!t.type.startsWith("image/")) return;
					this.getFileReader().readAsDataURL(t)
				}
			}
		}, B, [], false, null, "641581b7", null);
	H.options.__file = "src/components/image-option.vue";
	var j = H.exports,
		V = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div")
		};
	V._withStripped = true;
	var G = Object(t.a)({
		"data"() {
			return {
				hello: 123
			}
		}
	}, V, [], false, null, "384e68ec", null);
	G.options.__file = "src/components/template.vue";
	var Z = G.exports,
		K = d(1),
		q = d(4),
		X = d(5);

	function Y(e) {
		switch (e) {
			case 0:
				return "Thin";
			case 1:
				return "Normal";
			case 2:
				return "Bold";
			default:
				return "???";
		}
	}

	function J(e) {
		switch (e) {
			case 0:
				return "No";
			case 1:
				return "Thin";
			case 2:
				return "Thick";
			case 3:
				return "Thickest";
			default:
				return "???";
		}
	}

	function Q(e) {
		switch (e) {
			case 0:
				return "Small";
			case 1:
				return "Normal";
			case 2:
				return "Large";
			case 3:
				return "Largest";
			default:
				return "???";
		}
	}

	function ee(e, t) {
		if (!e) return null;
		return new Promise((s, a) => {
			var n = new Image;
			n.onload = () => {
				var e = document.createElement("canvas"),
					a = e.getContext("2d"),
					o = Math.max(n.width, n.height),
					i = Math.min(n.width, n.height),
					r = o === n.width,
					l = Math.min(o, t) / o,
					d = (r ? o : i) * l,
					c = (r ? i : o) * l;
				e.width = d, e.height = c, a.drawImage(n, 0, 0, d, c), s(e.toDataURL())
			}, n.onerror = a, n.src = e
		})
	}
	var te = PIXI.utils.isWebGLSupported(),
		se = te && q.useWebGL,
		ae = d(176),
		ne = Object(t.a)({
			components: {
				colorOption: x,
				imageOption: j
			},
			"data"() {
				return {
					useWebGL: se,
					bgDefault: q.getDefault("backgroundImageUrl"),
					virusDefault: q.getDefault("virusImageUrl"),
					showNameFontWarning: false,
					showMassFontWarning: false,
					backgroundColor: q.backgroundColor,
					borderColor: q.borderColor,
					foodColor: q.foodColor,
					ejectedColor: q.ejectedColor,
					cellNameOutlineColor: q.cellNameOutlineColor,
					cursorImageUrl: q.cursorImageUrl,
					backgroundImageUrl: q.backgroundImageUrl,
					virusImageUrl: q.virusImageUrl,
					cellMassColor: q.cellMassColor,
					cellMassOutlineColor: q.cellMassOutlineColor,
					cellNameFont: q.cellNameFont,
					cellNameWeight: q.cellNameWeight,
					cellNameOutline: q.cellNameOutline,
					cellNameSmoothOutline: q.cellNameSmoothOutline,
					cellMassFont: q.cellMassFont,
					cellMassWeight: q.cellMassWeight,
					cellMassOutline: q.cellMassOutline,
					cellMassSmoothOutline: q.cellMassSmoothOutline,
					cellMassTextSize: q.cellMassTextSize,
					cellLongNameThreshold: q.cellLongNameThreshold,
					shortMass: q.shortMass,
					showBackgroundImage: q.showBackgroundImage,
					backgroundImageRepeat: q.backgroundImageRepeat,
					backgroundDefaultIfUnequal: q.backgroundDefaultIfUnequal,
					backgroundImageOpacity: q.backgroundImageOpacity,
					useFoodColor: q.useFoodColor
				}
			},
			computed: {
				"cellNameWeightMeaning"() {
					return Y(this.cellNameWeight)
				},
				"cellMassWeightMeaning"() {
					return Y(this.cellMassWeight)
				},
				"cellNameOutlineMeaning"() {
					return J(this.cellNameOutline)
				},
				"cellMassOutlineMeaning"() {
					return J(this.cellMassOutline)
				},
				"cellMassTextSizeMeaning"() {
					return Q(this.cellMassTextSize)
				}
			},
			methods: {
				async "change"(e, t) {
					var s;
					if (t && t.target) {
						if (!isNaN(t.target.valueAsNumber)) s = t.target.valueAsNumber;
						else s = t.target.value
					} else s = t;
					try {
						switch (e) {
							case "cursorImageUrl":
								s = await ee(s, 32);
								break;
							case "backgroundImageUrl":
								if (s !== this.bgDefault) s = await ee(s, 4000);
								break;
							case "virusImageUrl":
								if (s !== this.virusDefault) s = await ee(s, 200);
								break;
						}
					} catch (e) {
						X.alert("This image is too large to even be loaded.");
						return
					}
					if (q[e] == s) return;
					var a = this[e];
					try {
						q.set(e, s)
					} catch (t) {
						q.set(e, a), X.alert("Saving this setting failed. Perhaps the image is too large?");
						return
					}
					this[e] = s;
					switch (e) {
						case "cursorImageUrl":
							K.events.$emit("set-cursor-url", s);
							break;
						case "backgroundColor":
							K.renderer.backgroundColor = PIXI.utils.string2hex(s);
							break;
						case "cellNameOutlineColor":
						case "cellNameFont":
						case "cellNameWeight":
						case "cellNameOutline":
						case "cellNameSmoothOutline":
							K.settings.compileNameFontStyle();
							break;
						case "cellMassColor":
						case "cellMassOutlineColor":
						case "cellMassFont":
						case "cellMassWeight":
						case "cellMassOutline":
						case "cellMassSmoothOutline":
						case "cellMassTextSize":
							K.settings.compileMassFontStyle();
							break;
						case "cellLongNameThreshold":
							K.scene.resetPlayerLongNames();
							break;
					}
					if (!K.running) return;
					switch (e) {
						case "borderColor":
							K.scene.resetBorder();
							break;
						case "foodColor":
							if (q.useFoodColor) K.scene.reloadFoodTextures();
							break;
						case "ejectedColor":
							K.scene.reloadEjectedTextures();
							break;
						case "virusImageUrl":
							K.scene.reloadVirusTexture();
							break;
						case "cellNameOutlineColor":
						case "cellNameFont":
						case "cellNameWeight":
						case "cellNameOutline":
						case "cellNameSmoothOutline":
							K.scene.resetNameTextStyle();
							break;
						case "cellMassColor":
						case "cellMassOutlineColor":
						case "cellMassFont":
						case "cellMassWeight":
						case "cellMassOutline":
						case "cellMassSmoothOutline":
						case "cellMassTextSize":
							K.scene.resetMassTextStyle(true);
							break;
						case "showBackgroundImage":
							K.scene.toggleBackgroundImage(s);
							break;
						case "backgroundImageUrl":
						case "backgroundImageRepeat":
						case "backgroundDefaultIfUnequal":
						case "backgroundImageOpacity":
							K.scene.setBackgroundImage();
							break;
						case "useFoodColor":
							K.scene.reloadFoodTextures();
							break;
					}
				},
				"confirmReset"() {
					X.confirm("Are you sure you want to reset all theming options?", () => this.reset())
				},
				"reset"() {
					var e = ["useWebGL", "bgDefault", "virusDefault", "showNameFontWarning", "showMassFontWarning"];
					for (var t in this.$data) {
						if (e.includes(t)) continue;
						this.change(t, q.getDefault(t))
					}
				},
				"fontWarning"(e, t) {
					switch (e) {
						case "name":
							this.showNameFontWarning = t;
							break;
						case "mass":
							this.showMassFontWarning = t;
							break;
					}
				}
			}
		}, n, [], false, null, "15c13b66", null);
	ne.options.__file = "src/components/theming.vue";
	var oe = ne.exports,
		re = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				attrs: {
					id: "hotkey-container"
				}
			}, [s("div", {
				staticClass: "hotkeys"
			}, [e._m(0), e._v(" "), e._l(e.availableHotkeys, function(t, a) {
				return s("div", {
					key: a,
					staticClass: "row"
				}, [s("span", {
					staticClass: "action"
				}, [e._v(e._s(a))]), e._v(" "), s("span", {
					staticClass: "bind",
					attrs: {
						tabindex: "0"
					},
					on: {
						mousedown: function(s) {
							return e.onMouseDown(s, t)
						},
						keydown: function(s) {
							return s.preventDefault(), e.onKeyDown(s, t)
						}
					}
				}, [e._v("\n                " + e._s(e.hotkeys[t]) + "\n            ")])])
			})], 2), e._v(" "), s("div", {
				staticClass: "footer"
			}, [s("span", {
				staticClass: "reset-button2",
				on: {
					click: e.onResetClick
				}
			}, [s("i", {
				staticClass: "fa fa-undo"
			}), e._v(" Reset\n        ")])])])
		};
	re._withStripped = true;
	var le = d(66),
		de = d(5);

	function ce() {
		var e = {
			Feed: "feed",
			"Feed macro": "feedMacro",
			Split: "split",
			Doublesplit: "splitx2",
			Triplesplit: "splitx3",
			"Quad split": "splitMax",
			"Split 32": "split32",
			"Split 64": "split64",
			"Split 128": "split128",
			"Split 256": "split256",
			"Diagonal linesplit": "linesplit",
			"Freeze mouse": "freezeMouse",
			"Lock linesplit": "lockLinesplit",
			"Stop movement": "stopMovement",
			Respawn: "respawn",
			"Toggle auto respawn": "toggleAutoRespawn",
			"Toggle skins": "toggleSkins",
			"Toggle names": "toggleNames",
			"Toggle food": "toggleFood",
			"Toggle mass": "toggleMass",
			"Toggle chat": "toggleChat",
			"Toggle chat popup": "toggleChatToast",
			"Toggle HUD": "toggleHud",
			"Spectate lock": "spectateLock",
			"Save replay": "saveReplay",
			"Zoom level 1": "zoomLevel1",
			"Zoom level 2": "zoomLevel2",
			"Zoom level 3": "zoomLevel3",
			"Zoom level 4": "zoomLevel4",
			"Zoom level 5": "zoomLevel5"
		};
		if (localStorage.adminMode) e["Select player"] = "selectPlayer";
		return e
	}
	var pe = d(178),
		me = Object(t.a)({
			"data"() {
				return {
					availableHotkeys: ce(),
					hotkeys: le.get()
				}
			},
			methods: {
				onResetClick: function() {
					de.confirm("Are you sure you want to reset all hotkeys?", () => {
						this.hotkeys = le.reset()
					})
				},
				onMouseDown: function(e, t) {
					if (e.target !== document.activeElement) return;
					var s = "MOUSE" + e.button;
					if (!le.set(t, s)) return;
					e.preventDefault(), this.hotkeys[t] = s, e.target.blur()
				},
				onKeyDown: function(e, t) {
					var s = le.convertKey(e.code);
					if (s === "ESCAPE" || s === "ENTER") {
						e.target.blur();
						return
					}
					if (s == "DELETE") s = "";
					le.set(t, s) && (this.hotkeys[t] = s, e.target.blur())
				}
			}
		}, re, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "row header"
			}, [s("b", [e._v("Left click")]), e._v(" (MOUSE0) to change"), s("br"), e._v(" "), s("b", [e._v("ESC")]), e._v(" cancels, "), s("b", [e._v("DELETE")]), e._v(" removes bind\n        ")])
		}], false, null, "2dbed53e", null);
	me.options.__file = "src/components/hotkeys.vue";
	var he = me.exports,
		ge = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "container"
			}, [s("input", {
				ref: "file",
				staticStyle: {
					display: "none"
				},
				attrs: {
					type: "file",
					accept: ".vanis",
					multiple: ""
				},
				on: {
					change: function(t) {
						return e.onFile(t)
					}
				}
			}), e._v(" "), s("div", {
				staticClass: "replay-list-header"
			}, [s("span", {
				staticClass: "replay-list-count"
			}, [e._v(e._s(e.keysLoadedFirst ? e.replayKeys.length + " replay" + (e.replayKeys.length !== 1 ? "s" : "") : "Loading"))]), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? s("span", {
				staticClass: "replay-list-page"
			}, [s("div", {
				staticClass: "anchor"
			}, [s("div", {
				staticClass: "left"
			}, [s("div", {
				staticClass: "current"
			}, [s("div", {
				staticClass: "phantom"
			}, [s("i", {
				staticClass: "fas fa-chevron-left prev",
				class: {
					disabled: !e.keysLoaded || e.pageIndex === 0
				},
				on: {
					click: function() {
						return e.updateReplayPage(-1)
					}
				}
			}), e._v(" "), s("span", [e._v(e._s(e.pageCount))])]), e._v(" "), !e.pageInputShown ? s("div", {
				staticClass: "real",
				on: {
					click: function() {
						return e.togglePageInput(true)
					}
				}
			}, [s("span", [e._v(e._s(1 + e.pageIndex))])]) : e._e(), e._v(" "), e.pageInputShown ? s("div", {
				staticClass: "real-input"
			}, [s("div", {
				staticClass: "overlay",
				on: {
					click: function() {
						return e.togglePageInput(false)
					}
				}
			}), e._v(" "), s("i", {
				staticClass: "fas fa-chevron-left prev",
				class: {
					disabled: !e.keysLoaded || e.pageIndex === 0
				},
				on: {
					click: function() {
						return e.updateReplayPage(-1)
					}
				}
			}), e._v(" "), s("input", {
				attrs: {
					type: "text"
				},
				domProps: {
					value: 1 + e.pageIndex
				},
				on: {
					focus: function(e) {
						return e.target.select()
					},
					change: function(t) {
						return e.updateReplayPage(t)
					}
				}
			})]) : e._e()])]), e._v("\n                /\n                "), s("div", {
				staticClass: "right"
			}, [e._v("\n                    " + e._s(e.pageCount) + "\n                    "), s("i", {
				staticClass: "fas fa-chevron-right next",
				class: {
					disabled: !e.keysLoaded || e.pageIndex === e.pageCount - 1
				},
				on: {
					click: function() {
						return e.updateReplayPage(1)
					}
				}
			})])])]) : e._e(), e._v(" "), s("span", {
				staticClass: "replay-list-bulk"
			}, [s("input", {
				staticClass: "vanis-button",
				attrs: {
					type: "button",
					disabled: !e.keysLoaded,
					value: "Import"
				},
				on: {
					click: function() {
						return e.$refs.file.click()
					}
				}
			}), e._v(" "), s("input", {
				staticClass: "vanis-button",
				attrs: {
					type: "button",
					disabled: !e.keysLoaded || e.keysEmpty,
					value: "Download all"
				},
				on: {
					click: function() {
						return e.downloadAllReplays()
					}
				}
			}), e._v(" "), s("input", {
				staticClass: "vanis-button",
				attrs: {
					type: "button",
					disabled: !e.keysLoaded || e.keysEmpty,
					value: "Delete all"
				},
				on: {
					click: function() {
						return e.deleteAllReplays()
					}
				}
			})])]), e._v(" "), s("div", {
				staticClass: "replay-list"
			}, [e.keysLoadedFirst && e.keysEmpty ? [s("div", {
				staticClass: "notification"
			}, [s("div", [e._v("Press "), s("b", [e._v(e._s(e.messageHotkey))]), e._v(" in game to save last "), s("b", [e._v(e._s(e.messageReplayDuration))]), e._v(" seconds of gameplay.")]), e._v(" "), s("div", {
				staticStyle: {
					color: "red",
					"font-weight": "bold"
				}
			}, [e._v("Replays are saved in browser memory!")]), e._v(" "), s("div", [e._v("They get permanently erased if browser data gets cleared.")])])] : e._e(), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? [s("div", {
				staticClass: "replay-page"
			}, e._l(e.pageData, function(e, t) {
				return s("replay-item", {
					key: t,
					attrs: {
						replay: e
					}
				})
			}), 1)] : e._e()], 2), e._v(" "), e.bulkOperating ? s("div", {
				staticClass: "overlay bulk-operation-overlay"
			}, [e._v("\n        Please wait...\n        "), e.bulkOperationStatus ? s("div", {
				staticClass: "small"
			}, [e._v(e._s(e.bulkOperationStatus))]) : e._e(), e._v(" "), e.showMultipleFilesWarning ? s("div", {
				staticClass: "small warning"
			}, [e._v("Allow page to download multiple files if asked")]) : e._e()]) : e._e()])
		};
	ge._withStripped = true;
	var ve = d(116),
		fe = d(89),
		ye = d(180),
		we = d(1),
		_e = d(66),
		ie = d(4),
		Ce = d(5),
		ke = d(8),
		xe = we.replay.database;

	function Se(e) {
		return new Promise((t, s) => {
			var a = new FileReader;
			a.onload = e => t(e.target.result), a.onerror = s, a.readAsText(e)
		})
	}
	const Me = 12,
		Te = 200;
	var Pe = {
			"data"() {
				return {
					keysLoadedFirst: false,
					keysLoaded: false,
					keysLoading: false,
					keysEmpty: false,
					replayKeys: [],
					pageInputShown: false,
					pageLoadingCancel: null,
					pageLoaded: false,
					pageIndex: 0,
					pageCount: 0,
					pageData: [],
					bulkOperating: false,
					bulkOperationStatus: "",
					showMultipleFilesWarning: false,
					messageHotkey: _e.get().saveReplay,
					messageReplayDuration: ie.replayDuration
				}
			},
			components: {
				replayItem: ve["default"]
			},
			methods: {
				"togglePageInput"(e) {
					this.pageInputShown = e
				},
				"setBulkOp"(e, t) {
					if (e) this.bulkOperating = true, this.bulkOperationStatus = t || "";
					else setTimeout(() => {
						this.bulkOperating = false, this.bulkOperationStatus = ""
					}, 1000)
				},
				async "onFile"(e) {
					if (this.bulkOperating) return;
					var t = Array.from(e.target.files);
					if (!t.length) return;
					if (e.target) e.target.value = null;
					var s = 0,
						a = t.length,
						n = t.map(async e => {
							var t = e.name.replace(/\.vanis$/, ""),
								n = await Se(e);
							await xe.setItem(t, n), this.setBulkOp(true, "Importing replays (" + ++s + " / " + a + ")")
						});
					this.setBulkOp(true, "Importing replays");
					try {
						await Promise.all(n)
					} catch (e) {
						Ce.alert("Error importing replays: \"" + e.message + "\""), this.setBulkOp(false), this.updateReplayKeys()
					}
					this.setBulkOp(false), this.updateReplayKeys()
				},
				async "downloadAllReplays"() {
					if (this.bulkOperating || !this.keysLoaded) return;
					var e = this.replayKeys.length,
						t = Math.ceil(this.replayKeys.length / Te),
						s = t > 1,
						a = ke.getTimestamp();
					this.showMultipleFilesWarning = s, this.setBulkOp(true, "Packing replays (0 / " + t + ")");
					for (var n = 0, o = 0, i; n < e; n += Te, o++) {
						i = new ye;
						for (var r = n, l; r < n + Te && r < e; r++) {
							l = this.replayKeys[r];
							i.file(l + ".vanis", await xe.getItem(l))
						}
						var d = await i.generateAsync({
								type: "blob"
							}),
							c = "replays_" + a;
						if (s) c += "_" + (o + 1);
						c += ".zip", fe.saveAs(d, c), this.setBulkOp(true, "Packing replays (" + (o + 1) + " / " + t + ")")
					}
					this.showMultipleFilesWarning = false, this.setBulkOp(false)
				},
				"deleteAllReplays"() {
					if (this.bulkOperating) return;
					var e = this;
					Ce.confirm("Are you absolutely sure that you want to delete all replays?", async () => {
						this.setBulkOp(true, "Deleting all replays");
						try {
							await xe.clear()
						} catch (e) {
							Ce.alert("Error clearing replays: " + e.message);
							return
						}
						this.setBulkOp(false), e.updateReplayKeys()
					})
				},
				async "updateReplayKeys"() {
					if (this.keysLoading) return;
					this.keysLoaded = false, this.keysLoading = true;
					var e = await xe.keys();
					e = e.reverse(), this.replayKeys.splice(0, this.replayKeys.length, ...e), this.pageCount = Math.max(Math.ceil(e.length / Me), 1), this.pageIndex = Math.min(this.pageIndex, this.pageCount - 1), this.keysLoaded = true, this.keysLoadedFirst = true, this.keysLoading = false, this.keysEmpty = e.length === 0, await this.updateReplayPage()
				},
				async "updateReplayPage"(e) {
					if (e) {
						if (typeof e === "number") this.pageIndex += e;
						else this.pageIndex = parseInt(e.target.value) - 1 || 0
					}
					this.pageLoadingCancel && (this.pageLoadingCancel(), this.pageLoadingCancel = null);
					var t = Math.max(Math.min(this.pageIndex, this.pageCount - 1), 0);
					if (this.pageIndex !== t) this.pageIndex = t;
					this.pageLoaded = false;
					var s = [],
						a = false;
					this.pageLoadingCancel = () => a = true;
					for (var n = this.pageIndex * Me, o = (1 + this.pageIndex) * Me, i = n; i < o && i < this.replayKeys.length; i++) {
						if (a) break;
						var r = this.replayKeys[i],
							l = {
								name: r,
								data: await xe.getItem(r)
							};
						if (l.data.startsWith("REPLAY")) l.image = l.data.split("|")[2];
						else l.image = "https://vanis.io/img/replay-placeholder.png";
						s.push(l)
					}
					if (a) return;
					this.pageData.splice(0, this.pageData.length, ...s), this.pageLoaded = true
				}
			},
			"created"() {
				this.updateReplayKeys(), we.events.$on("replay-added", this.updateReplayKeys), we.events.$on("replay-removed", this.updateReplayKeys)
			},
			"beforeDestroy"() {
				we.events.$off("replay-added", this.updateReplayKeys), we.events.$off("replay-removed", this.updateReplayKeys)
			}
		},
		Ie = d(220),
		Le = Object(t.a)(Pe, ge, [], false, null, "4a996e52", null);
	Le.options.__file = "src/components/replays3.vue";
	var Ee = Le.exports,
		Ue = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticStyle: {
					padding: "15px"
				}
			}, [s("h2", {
				staticStyle: {
					margin: "0",
					"margin-bottom": "14px"
				}
			}, [e._v(e._s(e.seasonLeaderboardText))]), e._v(" "), e.errorMessage ? s("div", [e._v("\n        Failed loading season leaderboard data:\n        " + e._s(e.errorMessage) + "\n    ")]) : e._e(), e._v(" "), e.playerList.length ? s("div", [s("div", {
				staticClass: "info"
			}, [e._v("\n            Season XP counts for this season only."), s("br"), e._v("\n            Top few players earn colored names."), s("br"), e._v("\n            Check our "), s("a", {
				attrs: {
					href: "https://vanis.io/discord"
				}
			}, [e._v("Discord")]), e._v(" for more information."), s("br"), e._v("\n            Season ends in "), s("b", [e._v(e._s(e.seasonEndTime))])]), e._v(" "), e._l(e.playerList, function(t, a) {
				return s("div", {
					key: a,
					staticClass: "player-row",
					class: {
						// me: e.ownUid && e.ownUid === t.uid
						me: !!e.isMe
					}
				}, [s("span", {
					staticClass: "player-nr"
				}, [e._v(e._s(a + 1) + ".")]), e._v(" "), s("span", {
					staticClass: "player-name",
					style: {
						color: t.name_color
					}
				}, [e._v(e._s(t.name))]), e._v(" "), s("span", {
					staticClass: "player-xp"
				}, [e._v(e._s(t. /*season_*/ xp) + " XP")])])
			})], 2) : e._e()])
		};
	Ue._withStripped = true;
	var Re = d(1),
		Ae = d(228),
		{
			checkBadWords: De
		} = d(17),
		Oe = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	function Ne(e) {
		if (e < 0) return "now";
		var t = Math.floor(e / 1000),
			s = t % 60,
			a = Math.floor(t / 60),
			n = a % 60,
			o = Math.floor(a / 60),
			i = o % 24,
			r = Math.floor(o / 24),
			l = [];
		if (r > 0) l.push(r + " day" + (r !== 1 ? "s" : ""));
		if (i % 24 > 0) l.push(i + " hour" + (i !== 1 ? "s" : ""));
		if (r === 0 && n % 60 > 0) l.push(n + " minute" + (n !== 1 ? "s" : ""));
		if (o === 0 && s % 60 > 0) l.push(s + " second" + (s !== 1 ? "s" : ""));
		return l.join(" ")
	}
	var Fe = d(222),
		$e = Object(t.a)({
			"data"() {
				return {
					playerList: [],
					errorMessage: "",
					ownUid: null,
					date: new Date,
					nextStartDate: Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1),
					seasonEndTime: null,
					seasonEndTimeInterval: null,
					selected: "sxp"
				}
			},
			computed: {
				"seasonLeaderboardText"() {
					return Oe[this.date.getUTCMonth()] + " " + this.date.getUTCFullYear() + " season"
				}
			},
			methods: {
				"setSeasonEndTime"() {
					this.seasonEndTime = Ne(this.nextStartDate - Date.now())
				}
			},
			async created() {
				const response = await Ae.get('/leaderboard/season_xp/100');
				if (!response.ok) return;
				const players = await response.json();
				this.playerList = players.map(x => ({
					name: x.perk_name || x.discord_name,
					name_color: '#' + (x.perk_color || 'ffffff'),
					badge: x.perk_badges || 0,
					xp: x.season_xp,
					isMe: x.me
				}));
				Re.events.$on("every-second", this.setSeasonEndTime);
				this.setSeasonEndTime();
			},
			"destroyed"() {
				Re.events.$off("every-second", this.setSeasonEndTime)
			}
		}, Ue, [], false, null, "7179a145", null);
	$e.options.__file = "src/components/meta-leaderboard.vue";
	var ze = $e.exports,
		Be = d(1),
		We = {
			components: {
				modal: R["default"],
				settings: F,
				theming: oe,
				hotkeys: he,
				replays3: Ee,
				metaLeaderboard: ze
			},
			"data"() {
				return {
					activeModal: "",
					showSettings: false,
					showHotkeys: false,
					gameState: Be.state,
					nickname: typeof localStorage.nickname === "string" ? localStorage.nickname : "",
					teamtag: localStorage.teamtag || "",
					skinUrl: typeof localStorage.skinUrl === "string" ? localStorage.skinUrl : "https://skins.vanis.io/s/vanis1"
				}
			},
			"created"() {
				Be.events.$on("skin-click", e => this.skinUrl = e)
			},
			methods: {
				"openModal"(e) {
					this.activeModal = e, this.$emit("modal-open", true)
				},
				"closeModal"() {
					this.activeModal = "", this.$emit("modal-open", false)
				},
				"play"(e) {
					if (!(e instanceof MouseEvent) || !e.isTrusted) return;
					if (!this.gameState.isAlive) Be.actions.join();
					Be.showMenu(false)
				},
				"spectate"() {
					if (this.gameState.isAlive) {
						console.warn("Cannot spectate, player is still alive");
						return
					}
					Be.actions.spectate(), Be.showMenu(false)
				},
				"onSkinUrlChange"() {
					Be.events.$emit("skin-url-edit", this.skinUrl)
				},
				"onTeamTagChange"() {
					localStorage.setItem("teamtag", this.teamtag)
				},
				"onNicknameChange"() {
					localStorage.setItem("nickname", this.nickname)
				}
			}
		},
		He = d(224),
		je = Object(t.a)(We, U, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticStyle: {
					"text-align": "center",
					height: "286px"
				}
			}, [s("div", {
				staticStyle: {
					padding: "4px"
				}
			}, [e._v('' /*"Advertisement"*/ )]), e._v(" "), s("div", {
				attrs: {
					id: "vanis-io_300x250"
				}
			})])
		}], false, null, "1bcde71e", null);
	je.options.__file = "src/components/player.vue";
	var Ve = je.exports,
		Ge = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticStyle: {
					padding: "17px"
				}
			}, [!e.account ? s("div", [s("div", {
				staticStyle: {
					"margin-top": "6px",
					"margin-bottom": "10px"
				}
			}, [e._v("Login to your account with Discord to save your in-game progress.")]), e._v(" "), s("div", {
				staticClass: "discord",
				on: {
					click: function() {
						return e.openDiscordLogin()
					}
				}
			}, [e.loading ? [e.loading ? s("i", {
				staticClass: "fas fa-sync fa-spin",
				staticStyle: {
					"margin-right": "5px"
				}
			}) : e._e(), e._v(" Loading\n            ")] : [s("i", {
				staticClass: "fab fa-discord"
			}), e._v(" Login with Discord\n            ")]], 2)]) : e._e(), e._v(" "), e.account ? s("div", {
				staticClass: "account"
			}, [s("div", {
				staticStyle: {
					"margin-bottom": "3px"
				}
			}, [s("img", {
				staticClass: "avatar",
				attrs: {
					src: e.avatarUrl
				}
			}), e._v(" "), s("div", {
				staticClass: "player-info"
			}, [s("div", {
				style: {
					color: e.nameColor
				},
				attrs: {
					id: "account-name"
				}
			}, [e._v(e._s(e.name))]), e._v(" "), s("div", [e._v("Level " + e._s(e.account.level))]), e._v(" "), s("div", [e._v(e._s(e.account.xp) + " total XP")]), e._v(" "), s("div", [e._v(e._s(e.account.season_xp || 0) + " season XP")])])]), e._v(" "), s("div", {
				staticStyle: {
					position: "relative"
				}
			}, [s("progress-bar", {
				staticClass: "xp-progress",
				attrs: {
					progress: e.progress
				}
			}), e._v(" "), s("div", {
				staticClass: "xp-data"
			}, [s("div", {
				staticStyle: {
					flex: "1",
					"margin-left": "8px"
				}
			}, [e._v(e._s(e.xpAtCurrentLevel))]), e._v(" "), s("div", {
				staticStyle: {
					"margin-right": "7px"
				}
			}, [e._v(e._s(e.xpAtNextLevel))])])], 1), e._v(" "), s("div", {
				staticClass: "logout_",
				on: {
					click: function() {
						return e.logout()
					}
				}
			}, [s("i", {
				staticClass: "fas fa-sign-out-alt"
			})])]) : e._e()])
		};
	Ge._withStripped = true;
	var Ze = function() {
		var e = this,
			t = e.$createElement,
			s = e._self._c || t;
		return s("div", {
			staticClass: "progress progress-striped"
		}, [s("div", {
			staticClass: "progress-bar",
			style: {
				width: e.progress * 100 + "%"
			}
		})])
	};
	Ze._withStripped = true;
	var Ke = d(226),
		qe = Object(t.a)({
			// props: ["progress"]
			props: {
				progress: {
					type: Number,
					required: true
				}
			}
		}, Ze, [], false, null, "55dc99fa", null);
	qe.options.__file = "src/components/progress-bar.vue";
	var Xe = qe.exports,
		Ye = d(228),
		Swal = d(5),
		Qe = d(1),
		et = d(229),
		tt = d(230),
		st = Object(t.a)({
			components: {
				progressBar: Xe
			},
			"data"() {
				return {
					accountTime: 0,
					account: null,
					progress: 0,
					xpAtCurrentLevel: 0,
					xpAtNextLevel: 0,
					loading: false,
					avatarUrl: null,
					nameColor: null,
					name: null
				}
			},
			"created"() {
				Qe.events.$on("xp-update", this.onXpUpdate), this.reloadUserData(), this.listenForToken()
			},
			"beforeDestroy"() {
				Qe.events.$off("xp-update", this.onXpUpdate)
			},
			methods: {
				"listenForToken"() {
					window.addEventListener("message", e => {
						var t = e.data.vanis_token;
						t && (this.onLoggedIn(t), e.source.postMessage("loggedIn", e.origin))
					})
				},
				"reloadUserData"() {
					if (Date.now() - this.accountTime <= 60000) return;
					this.accountTime = Date.now();
					if (Ye.vanisToken) this.loadUserData()
				},
				async loadUserData() {
					this.loading = true;
					const response = await Ye.get('/me');
					if (!response.ok) {
						this.loading = false;
						console.error("Account:", response.status, response.statusText);
						if (response.status === 401) {
							Ye.clearToken();		
						} else if (response.status === 503) {
							Swal.alert(await response.text());
						}
						return;
					}
					const data = await response.json();
					this.setAccountData(data);
					this.updateProgress(this.account.xp, this.account.level);
					this.loading = false;
				},

				async logout() {
					try {
						await Ye.call('DELETE', '/me');
					} catch (error) {
						const {response} = error;
						if (response && response.status !== 401) {
							Swal.alert(`Error: ${error.message}`);
						}
					}
					Ye.clearToken();
					this.account = null;
					this.name = null;
					this.nameColor = null;
					this.avatarUrl = null;
					Ge.ownUid = null;
				},
				"getAvatarUrl"(e, t) {
					if (t) return "https://cdn.discordapp.com/avatars/" + e + "/" + t + ".png";
					return "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"setAccountData"(e) {
					if (e.permissions) window.gameObj = Qe;
					this.account = e, this.avatarUrl = this.getAvatarUrl(e.discord_id, e.discord_avatar), this.name = e.locked_name || e.discord_name, this.nameColor = e.name_color ? "#" + e.name_color : "#ffffff", Qe.ownUid = e.uid
				},
				"onXpUpdate"(e) {
					if (!this.account) return;
					var t = et.getLevel(e);
					this.account.season_xp += e - this.account.xp, this.account.xp = e, this.account.level = t, this.updateProgress(e, t)
				},
				"updateProgress"(e, t) {
					this.xpAtCurrentLevel = et.getXp(t), this.xpAtNextLevel = et.getXp(t + 1), this.progress = (e - this.xpAtCurrentLevel) / (this.xpAtNextLevel - this.xpAtCurrentLevel)
				},
				openDiscordLogin: function() {
					window.open(Ye.url + "/login/discord", "", "width=500, height=750")
				},
				"onLoggedIn"(e) {
					console.assert(e, "Vanis token empty or undefined"), Ye.setToken(e), this.loadUserData()
				}
			}
		}, Ge, [], false, null, "661435cd", null);
	st.options.__file = "src/components/account.vue";
	var at = st.exports,
		nt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				attrs: {
					id: "customization"
				}
			}, [s("div", {
				attrs: {
					id: "skins"
				}
			}, [e._l(e.skins, function(t, a) {
				return s("span", {
					key: a,
					staticClass: "skin-container"
				}, [s("img", {
					staticClass: "skin",
					class: {
						selected: e.selectedSkinIndex === a
					},
					attrs: {
						src: t,
						alt: ""
					},
					on: {
						click: function() {
							return e.selectSkin(a)
						},
						contextmenu: function() {
							return e.removeSkin(a)
						}
					}
				}), e._v(" "), s("i", {
					staticClass: "fas fa-times skin-remove-button",
					on: {
						click: function() {
							return e.removeSkin(a)
						}
					}
				})])
			}), e._v(" "), s("img", {
				staticClass: "skin add-skin",
				attrs: {
					src: "/img/skin-add.png",
					alt: ""
				},
				on: {
					click: function() {
						return e.addSkin()
					}
				}
			})], 2)])
		};
	nt._withStripped = true;
	var ot = d(1),
		it = d(232),
		rt = Object(t.a)({
			"data"() {
				return {
					selectedSkinIndex: 0,
					skins: [],
					skinsLoaded: []
				}
			},
			"created"() {
				ot.events.$on("skin-url-edit", this.onSkinUrlChanged.bind(this)), this.skins = this.loadSkins() || this.getDefaultSkins();
				var e = +localStorage.selectedSkinIndex || 0;
				this.selectSkin(e)
			},
			methods: {
				"loadSkins"() {
					var e = localStorage.skins;
					if (!e) return false;
					try {
						var t = JSON.parse(e)
					} catch (e) {
						return console.error("Error parsing saved skins", e.message), false
					}
					if (!Array.isArray(t)) return console.error("localstorage.skins is not an array!"), false;
					for (var s = t.length; s < 2; s++) t.push("https://skins.vanis.io/s/vanis1");
					return t
				},
				"getDefaultSkins"() {
					for (var e = [], t = 0; t < 8; t++) e.push("https://skins.vanis.io/s/vanis1");
					return e
				},
				"onSkinUrlChanged"(e) {
					this.$set(this.skins, this.selectedSkinIndex, e), this.saveSkins()
				},
				"selectSkin"(e) {
					this.selectedSkinIndex = e, localStorage.selectedSkinIndex = e;
					var t = this.skins[e];
					ot.events.$emit("skin-click", t)
				},
				"removeSkin"(e) {
					this.skins.splice(e, 1);
					if (this.skins.length < 2) this.skins.push("https://skins.vanis.io/s/vanis1");
					this.saveSkins();
					var t = Math.max(0, this.selectedSkinIndex - 1);
					this.selectSkin(t)
				},
				"addSkin"() {
					var e = this.skins.length;
					this.skins.push("https://skins.vanis.io/s/vanis1"), this.selectSkin(e), this.saveSkins()
				},
				"saveSkins"() {
					localStorage.skins = JSON.stringify(this.skins)
				}
			}
		}, nt, [], false, null, "cd936b1a", null);
	rt.options.__file = "src/components/customization.vue";
	var lt = rt.exports,
		ue = d(1),
		dt = d(234),
		ct = Object(t.a)({
			"data"() {
				return {
					isModalOpen: false,
					selectedTab: "servers",
					gameState: ue.state,
					cursorStyleElem: null
				}
			},
			methods: {
				onModalChange: function(e) {
					this.isModalOpen = e
				},
				"setCursorUrl"(e) {
					var t = null;
					if (e) t = "#canvas, #hud > * { cursor: url('" + e + "'), auto !important; }";
					if (!t && this.cursorStyleElem) this.cursorStyleElem.remove(), this.cursorStyleElem = null;
					else t && !this.cursorStyleElem && (this.cursorStyleElem = document.createElement("style"), document.head.appendChild(this.cursorStyleElem));
					if (this.cursorStyleElem) this.cursorStyleElem.innerHTML = t
				}
			},
			components: {
				servers: p,
				playerContainer: Ve,
				account: at,
				skins: lt
			},
			"created"() {
				ue.events.$on("set-cursor-url", e => this.setCursorUrl(e))
			},
			"mounted"() {
				this.setCursorUrl(ue.settings.cursorImageUrl)
			}
		}, y, [], false, null, "ebed1606", null);
	ct.options.__file = "src/components/main-container.vue";
	var pt = ct.exports,
		ut = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e._m(0)
		};
	ut._withStripped = true;
	var mt = d(236),
		ht = Object(t.a)({}, ut, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "social-container"
			}, [s("a", {
				staticClass: "discord-link",
				attrs: {
					href: "https://vanis.io/discord",
					target: "_blank",
					rel: "noopener"
				}
			}, [s("i", {
				staticClass: "fab fa-discord"
			}), e._v(" Official Discord\n    ")]), e._v(" "), s("a", {
				staticClass: "tournaments-link",
				attrs: {
					href: "https://vanis.io/tournaments",
					target: "_blank",
					rel: "noopener"
				}
			}, [s("i", {
				staticClass: "fas fa-trophy"
			}), e._v(" Tournaments\n    ")]), e._v(" "), s("a", {
				staticClass: "youtube-link",
				attrs: {
					href: "https://www.youtube.com/channel/UCc6nxxjrUz5J-u6AW7YiXUw",
					target: "_blank",
					rel: "noopener"
				}
			}, [s("i", {
				staticClass: "fab fa-youtube"
			}), e._v(" Highlights\n    ")]), e._v(" "), s("a", {
				attrs: {
					href: "https://skins.vanis.io",
					target: "_blank",
					rel: "noopener",
					id: "skins-link"
				}
			}, [s("i", {
				staticClass: "fas fa-images"
			}), e._v(" Skins\n    ")])])
		}], false, null, "4d0670e9", null);
	ht.options.__file = "src/components/social-links.vue";
	var gt = ht.exports,
		vt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e._m(0)
		};
	vt._withStripped = true;
	var ft = d(238),
		yt = Object(t.a)({
			"data"() {}
		}, vt, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "container"
			}, [s("a", {
				staticStyle: {
					"margin-left": "20.59px"
				},
				attrs: {
					href: "privacy.html",
					target: "_blank"
				}
			}, [e._v("Privacy Policy")]), e._v(" "), s("span", {
				staticClass: "line"
			}, [e._v("|")]), e._v(" "), s("a", {
				attrs: {
					href: "tos.html",
					target: "_blank"
				}
			}, [e._v("Terms of Service")])])
		}], false, null, "6843da33", null);
	yt.options.__file = "src/components/privacy-tos.vue";
	var wt = yt.exports,
		_t = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e.show ? s("div", {
				staticClass: "context-menu fade",
				style: {
					top: e.y + "px",
					left: e.x + "px"
				}
			}, [s("div", {
				staticClass: "player-name"
			}, [e._v(e._s(e.playerName))]), e._v(" "), s("div", [e._v("Block")]), e._v(" "), s("div", {
				on: {
					click: e.hideName
				}
			}, [e._v("Hide Name")]), e._v(" "), s("div", {
				on: {
					click: e.hideSkin
				}
			}, [e._v("Hide Skin")]), e._v(" "), s("div", [e._v("Kick")]), e._v(" "), s("div", [e._v("Ban")]), e._v(" "), s("div", [e._v("Mute")])]) : e._e()
		};
	_t._withStripped = true;
	var Ct = d(1),
		kt = d(240),
		xt = Object(t.a)({
			"data"() {
				return {
					show: false,
					playerName: "",
					x: 100,
					y: 55
				}
			},
			methods: {
				open: function(e, t) {
					this.player = t, this.playerName = t.name, this.x = e.clientX, this.y = e.clientY, this.show = true, document.addEventListener("click", () => {
						this.show = false
					}, {
						once: true
					})
				},
				hideName: function() {
					this.player.setName(""), this.player.invalidateVisibility()
				},
				hideSkin: function() {
					this.player.setSkin(""), this.player.invalidateVisibility()
				}
			},
			"created"() {}
		}, _t, [], false, null, "4dbee04d", null);
	xt.options.__file = "src/components/context-menu.vue";
	var St = xt.exports,
		Mt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				attrs: {
					id: "hud"
				}
			}, [s("stats"), e._v(" "), s("chatbox"), e._v(" "), s("leaderboard"), e._v(" "), s("minimap"), e._v(" "), s("cautions")], 1)
		};
	Mt._withStripped = true;
	var Tt = function() {
		var e = this,
			t = e.$createElement,
			s = e._self._c || t;
		return s("div", [s("div", {
			staticClass: "server-cautions"
		}, e._l(e.serverInfo, function(t) {
			return s("div", [e._v(e._s(t))])
		}), 0), e._v(" "), s("div", {
			staticClass: "cautions"
		}, [!e.stopped && e.showMouseFrozen ? s("div", [e._v("MOUSE FROZEN")]) : e._e(), e._v(" "), !e.stopped && e.showMovementStopped ? s("div", [e._v("MOVEMENT STOPPED")]) : e._e(), e._v(" "), !e.stopped && e.showLinesplitting ? s("div", [e._v("LINESPLITTING")]) : e._e()])])
	};
	Tt._withStripped = true;
	var Pt = d(1),
		It = d(242),
		Lt = Object(t.a)({
			"data"() {
				return {
					showMouseFrozen: false,
					showMovementStopped: false,
					showLinesplitting: false,
					serverInfo: null
				}
			},
			"mounted"() {
				Pt.events.$on("update-cautions", e => {
					if ("mouseFrozen" in e) this.showMouseFrozen = e.mouseFrozen;
					if ("moveToCenterOfCells" in e) this.showMovementStopped = e.moveToCenterOfCells;
					if ("lockLinesplit" in e) this.showLinesplitting = e.lockLinesplit;
					if ("custom" in e) this.serverInfo = e.custom.split(/\r\n|\r|\n/)
				}), Pt.events.$on("reset-cautions", () => {
					this.showMouseFrozen = false, this.showMovementStopped = false, this.showLinesplitting = false
				}), Pt.events.$on("game-stopped", () => {
					this.serverInfo = null
				})
			}
		}, Tt, [], false, null, "b7599310", null);
	Lt.options.__file = "src/components/cautions.vue";
	var Et = Lt.exports,
		bt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.visible,
					expression: "visible"
				}],
				staticClass: "stats"
			}, [s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showFPS,
					expression: "showFPS"
				}]
			}, [e._v("FPS: " + e._s(e.fps || "-"))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showPing,
					expression: "showPing"
				}]
			}, [e._v("Ping: " + e._s(e.ping || "-"))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showPlayerMass && e.mass,
					expression: "showPlayerMass && mass"
				}]
			}, [e._v("Mass: " + e._s(e.mass))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showPlayerScore && e.score,
					expression: "showPlayerScore && score"
				}]
			}, [e._v("Score: " + e._s(e.score))]), e._v(" "), s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.showCellCount && e.cells,
					expression: "showCellCount && cells"
				}]
			}, [e._v("Cells: " + e._s(e.cells))])])
		};
	bt._withStripped = true;
	var Ut = d(1),
		Rt = d(4),
		At = d(244),
		Dt = Object(t.a)({
			"data"() {
				return {
					showFPS: Rt.showFPS,
					showPing: Rt.showPing,
					showPlayerMass: Rt.showPlayerMass,
					showPlayerScore: Rt.showPlayerScore,
					showCellCount: Rt.showCellCount,
					visible: false,
					ping: 0,
					fps: 0,
					mass: 0,
					score: 0,
					cells: 0
				}
			},
			"created"() {
				Ut.events.$on("stats-visible", e => this.visible = e), Ut.events.$on("stats-invalidate-shown", () => {
					this.showFPS = Rt.showFPS, this.showPing = Rt.showPing, this.showPlayerMass = Rt.showPlayerMass, this.showPlayerScore = Rt.showPlayerScore, this.showCellCount = Rt.showCellCount
				}), Ut.events.$on("cells-changed", e => this.cells = e), Ut.events.$on("stats-changed", e => {
					this.ping = e.ping || 0, this.fps = e.fps || 0, this.mass = e.mass ? Ut.getMassText(e.mass) : 0, this.score = e.score ? Ut.getMassText(e.score) : 0
				})
			}
		}, bt, [], false, null, "0875ad82", null);
	Dt.options.__file = "src/components/stats.vue";
	var Ot = Dt.exports,
		Nt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.visible,
					expression: "visible"
				}],
				staticClass: 'chat-container',
				on: {
					click: function(t) {
						return e.onChatClick(t)
					},
					contextmenu: function(t) {
						return e.onChatRightClick(t)
					}
				}
			}, [e.visibleToast ? [s("transition-group", {
				attrs: {
					name: "toast",
					tag: "div",
					id: "toast-list"
				}
			}, e._l(e.toastMessages, function(t) {
				return s("span", {
					key: t.id
				}, [s("span", {
					staticClass: "message-row"
				}, [t.from ? [s("span", {
					staticClass: "message-from",
					style: {
						color: t.fromColor
					},
					attrs: {
						"data-pid": t.pid
					}
				}, [e._v(e._s(t.from))]), e._v(":\n                    ")] : e._e(), e._v(" "), s("span", {
					staticClass: "message-text",
					style: {
						color: t.textColor
					}
				}, [e._v(e._s(t.text))])], 2)])
			}), 0)] : e._e(), e._v(" "), s("div", {
				staticClass: 'chatbox',
				class: {
					toasts: e.visibleToast,
					visible: e.visibleInput
				},
				style: e.visibleToast ? {} : {
					height: '200px'
				}
			}, [e.showBlockedMessageCount && e.blockedMessageCount ? s("div", {
				staticStyle: {
					position: "absolute",
					top: "-28px"
				}
			}, [e._v("Blocked messages: " + e._s(e.blockedMessageCount))]) : e._e(), e._v(" "), !e.visibleToast ? [s("div", {
				ref: "list",
				staticClass: 'message-list'
			}, e._l(e.messages, function(t, a) {
				return s("div", {
					key: a,
					staticClass: "message-row"
				}, [t.from ? [s("span", {
					staticClass: "message-from",
					style: {
						color: t.fromColor
					},
					attrs: {
						"data-pid": t.pid
					}
				}, [e._v(e._s(t.from))]), e._v(":\n                    ")] : e._e(), e._v(" "), s("span", {
					staticClass: "message-text",
					style: {
						color: t.textColor
					}
				}, [e._v(e._s(t.text))])], 2)
			}), 0)] : e._e(), e._v(" "), s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.inputText,
					expression: "inputText"
				}],
				ref: "input",
				attrs: {
					id: "chatbox-input",
					type: "text",
					spellcheck: "false",
					autocomplete: "off",
					maxlength: "100",
					tabindex: "-1",
					placeholder: "Type your message here"
				},
				domProps: {
					value: e.inputText
				},
				on: {
					keydown: function(t) {
						if (!t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter")) return null;
						return e.sendChatMessage()
					},
					input: function(t) {
						if (t.target.composing) return;
						e.inputText = t.target.value
					}
				}
			})], 2)], 2)
		};
	Nt._withStripped = true;
	var Ft = d(1),
		$t = d(4),
		zt = d(5),
		{
			replaceBadWordsChat: Bt
		} = d(17),
		Wt = {},
		Ht = d(246),
		jt = Object(t.a)({
			"data"() {
				return {
					visible: false,
					visibleToast: $t.showChatToast,
					visibleInput: false,
					inputText: "",
					messages: [],
					toastMessages: [],
					showBlockedMessageCount: $t.showBlockedMessageCount,
					blockedMessageCount: 0,
					nextMessageId: 0
				}
			},
			methods: {
				"onChatClick"(e) {
					var t = e.target.dataset.pid;
					if (!t) return;
					Ft.selectedPlayer = t, Ft.actions.spectate(t)
				},
				onChatRightClick(e) {
					const pid = e.target.dataset.pid;
					if (!pid) return;
					const {
						playerManager
					} = Ft;
					if (!playerManager.players.has(pid)) {
						zt.alert("Player does not exist or disconnected");
						return;
					}
					const player = playerManager.players.get(pid);
					if (Wt[pid]) {
						this.confirmUnblockPlayer(player);
					} else {
						this.confirmBlockPlayer(player);
					}
				},
				"confirmBlockPlayer"(e) {
					zt.confirm("Block player \"" + e.name + "\" until restart?", () => {
						if (e.isMe && true) {
							zt.alert("You can not block yourself");
							return
						}
						Wt[e.pid] = e.name, Ft.events.$emit("chat-message", "Blocked player \"" + e.name + "\"")
					})
				},
				"confirmUnblockPlayer"(e) {
					zt.confirm("Unblock player \"" + e.name + "\"?", () => {
						delete Wt[e.pid], Ft.events.$emit("chat-message", "Unblocked player \"" + e.name + "\"")
					})
				},
				"sendChatMessage"() {
					var e = this.inputText.trim();
					if (e) {
						if (Ft.selectedPlayer) e = e.replace(/\$pid/g, Ft.selectedPlayer);
						Ft.connection.sendChatMessage(e), this.inputText = ""
					}
					Ft.renderer.view.focus(), this.scrollBottom(true)
				},
				"onChatMessage"(e) {
					if (typeof e === "string") e = {
						text: e,
						textColor: "#828282"
					};
					if (Wt[e.pid]) {
						this.blockedMessageCount++;
						return
					}
					if ($t.filterChatMessages) e.text = Bt(e.text);
					e.fromColor = e.fromColor || "#ffffff", e.textColor = e.textColor || "#ffffff", this.messages.push(e);
					if (this.messages.length > 100) this.messages.shift();
					e.id = this.nextMessageId++, e.until = Date.now() + Math.max(5000, e.text.length * 150), this.toastMessages.unshift(e), this.scrollBottom(false)
				},
				"onVisibilityChange"({
					visible: e,
					visibleToast: t
				}) {
					if (e != null) this.visible = e;
					t != null && (this.visibleToast = t, this.visibleInput = this.visible && !t), this.$nextTick(() => this.scrollBottom(true))
				},
				"focusChat"() {
					if (!this.visible) return;
					this.visibleInput = true, this.$nextTick(() => this.$refs.input.focus())
				},
				"clearChat"() {
					if (!$t.clearChatMessages) return;
					this.messages.splice(0, this.messages.length), this.toastMessages.splice(0, this.toastMessages.length), this.nextMessageId = 0
				},
				"scrollBottom"(e = false) {
					if (this.visibleToast) return;
					var t = this.$refs.list,
						s = t.scrollHeight - t.clientHeight;
					if (!e && s - t.scrollTop > 30) return;
					this.$nextTick(() => t.scrollTop = t.scrollHeight)
				},
				"filterToasts"() {
					for (var e = 0; e < this.toastMessages.length; e++) {
						if (this.toastMessages[e].until >= Date.now()) continue;
						this.toastMessages.splice(e--, 1)
					}
				}
			},
			"created"() {
				Ft.events.$on("chat-visible", this.onVisibilityChange), Ft.events.$on("chat-focus", this.focusChat), Ft.events.$on("chat-message", this.onChatMessage), Ft.events.$on("server-message", this.onServerMessage), Ft.events.$on("every-second", this.filterToasts), Ft.events.$on("chat-clear", this.clearChat), Ft.events.$on("show-blocked-message-count", e => this.showBlockedMessageCount = e), Ft.events.$on("game-stopped", () => {
					this.blockedMessageCount = 0, Wt = {}
				}), document.addEventListener("focusin", e => {
					this.visibleInput = !this.visibleToast || e.target === this.$refs.input
				})
			}
		}, Nt, [], false, null, "4900a413", null);
	jt.options.__file = "src/components/chatbox.vue";
	var be = jt.exports,
		Vt = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.userVisible && e.visible,
					expression: "userVisible && visible"
				}],
				attrs: {
					id: "leaderboard"
				}
			}, [s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.headerVisible,
					expression: "headerVisible"
				}],
				staticClass: "leaderboard-title"
			}, [e._v(e._s(e.headerText))]), e._v(" "), s("div", e._l(e.leaderboard, function(t, a) {
				return s("div", {
					key: a,
					staticClass: "leaderboard-label"
				}, ["position" in t ? s("span", [e._v(e._s(t.position) + ".")]) : e._e(), e._v(" "), s("span", {
					class: {
						spectating: !e.gameState.isAlive
					},
					style: {
						color: t.color,
						fontWeight: t.bold ? "bold" : "normal"
					},
					attrs: {
						"data-pid": t.pid
					},
					on: {
						click: function(t) {
							return e.leftClickLabel(t)
						}
					}
				}, [e._v(e._s(t.text))])])
			}), 0)])
		};
	Vt._withStripped = true;
	var Gt = d(1),
		Zt = d(4),
		Kt = d(248),
		qt = Object(t.a)({
			"data"() {
				return {
					userVisible: Zt.showLeaderboard,
					visible: false,
					headerVisible: true,
					headerText: "Leaderboard",
					leaderboard: [],
					gameState: Gt.state
				}
			},
			methods: {
				"updateLeaderboard"(e, t) {
					this.leaderboard = e;
					if (t) this.headerVisible = t.visible, this.headerText = t.text;
					else {
						if (Zt.showServerName && this.gameState.selectedServer) {
							this.headerVisible = true;
							var s = this.gameState.selectedServer.region || "";
							if (s) s += " ";
							this.headerText = s + this.gameState.selectedServer.name
						} else this.headerVisible = true, this.headerText = "Leaderboard"
					}
				},
				"leftClickLabel"() {
					var e = event.target.dataset.pid;
					e && (Gt.selectedPlayer = e, Gt.actions.spectate(e))
				},
				"onLeaderboardShow"() {
					if (this.visible) return;
					Gt.events.$on("leaderboard-update", this.updateLeaderboard), this.visible = true
				},
				"onLeaderboardHide"() {
					if (!this.visible) return;
					Gt.events.$off("leaderboard-update", this.updateLeaderboard), this.leaderboard = [], this.visible = false, this.selectedServer = null
				}
			},
			"created"() {
				Gt.events.$on("leaderboard-visible", e => this.userVisible = e), Gt.events.$on("leaderboard-show", this.onLeaderboardShow), Gt.events.$on("leaderboard-hide", this.onLeaderboardHide)
			}
		}, Vt, [], false, null, "8a0c31c6", null);
	qt.options.__file = "src/components/leaderboard.vue";
	var Xt = qt.exports,
		Yt = d(117),
		Jt = {
			components: {
				stats: Ot,
				chatbox: be,
				minimap: Yt["default"],
				leaderboard: Xt,
				cautions: Et
			}
		},
		Qt = d(252),
		es = Object(t.a)(Jt, Mt, [], false, null, "339660d2", null);
	es.options.__file = "src/components/hud.vue";
	var ts = es.exports,
		ss = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("transition", {
				attrs: {
					name: "menu"
				}
			}, [s("div", {
				staticClass: "container"
			}, [s("div", {
				staticClass: "stuck-mention",
				class: {
					"show-stuck": e.canContinue
				}
			}, [e._v("If you are stuck, press ESC to continue")]), e._v(" "), s("div", {
				staticClass: "fade-box box-1"
			}, [s("div", {
				staticStyle: {
					padding: "4px"
				}
			}, [e._v('' /*"Advertisement"*/ )]), e._v(" "), s("div", {
				staticStyle: {
					padding: "10px",
					"padding-top": "0px"
				}
			}, [s("div", {
				attrs: {
					id: "vanis-io_300x250_2"
				}
			})])]), e._v(" "), e.stats ? s("div", {
				staticClass: "fade-box",
				class: {
					scroll: e.isLoadingAd
				}
			}, [s("div", {
				staticStyle: {
					padding: "15px"
				}
			}, [s("div", [e._v("Time alive: " + e._s(e.timeAlive))]), e._v(" "), s("div", [e._v("Highscore: " + e._s(e.highscore))]), e._v(" "), s("div", [e._v("Players eaten: " + e._s(e.stats.killCount))]), e._v(" "), s("btn", {
				staticClass: "continue",
				attrs: {
					disabled: !e.canContinue
				},
				nativeOn: {
					click: function(t) {
						return e.close(t)
					}
				}
			}, [e._v("Continue")])], 1)]) : e._e()])])
		};
	ss._withStripped = true;
	var as = d(1),
		ns = d(77),
		os = d(254),
		is = Object(t.a)({
			props: ["stats"],
			"data"() {
				return {
					isLoadingAd: false,
					canContinue: false
				}
			},
			computed: {
				"timeAlive"() {
					var e = this.stats.timeAlive;
					if (e < 60) return e + "s";
					var t = Math.floor(e / 60);
					return t + "min " + e % 60 + "s"
				},
				"highscore"() {
					return as.getMassText(this.stats.highscore)
				}
			},
			methods: {
				"loadAd"() {
					// this.isLoadingAd = ns.refreshAd("death-box"), 
					this.canContinue = false;
					setTimeout(() => {
						this.canContinue = true;
					}, /*this.isLoadingAd ? 2250 : */ 1000);
				},
				"close"(e) {
					if ((!e instanceof MouseEvent || !e.isTrusted) && e !== true) return;
					if (!this.canContinue) return;
					as.state.deathDelay = false;
					as.app.showDeathScreen = false;
					as.showMenu(true, true);
				}
			},
			"created"() {
				as.events.$on("refresh-deathscreen-ad", this.loadAd), as.events.$on("continue-deathscreen", () => this.close(true))
			}
		}, ss, [], false, null, "3249d726", null);
	is.options.__file = "src/components/death-stats.vue";
	var rs = is.exports,
		ls = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("button", {
				staticClass: "btn"
			}, [e._t("default", [e._v("Here should be something")])], 2)
		};
	ls._withStripped = true;
	var ds = d(256),
		cs = Object(t.a)({}, ls, [], false, null, "b0b10308", null);
	cs.options.__file = "src/components/btn.vue";
	var ps = cs.exports,
		us = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e.show ? s("div", {
				class: {
					"auto-hide": e.autoHideReplayControls
				},
				attrs: {
					id: "replay-controls"
				}
			}, [s("div", {
				staticStyle: {
					"text-align": "right"
				}
			}, [s("div", [e._v("Opacity " + e._s(e.cellOpacity) + "%")]), e._v(" "), s("div", [s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.cellOpacity,
					expression: "cellOpacity"
				}],
				staticClass: "replay-slider",
				staticStyle: {
					width: "105px",
					display: "inline-block"
				},
				attrs: {
					id: "replay-opacity-slider",
					type: "range",
					min: "10",
					max: "100"
				},
				domProps: {
					value: e.cellOpacity
				},
				on: {
					input: e.onCellOpacitySlide,
					__r: function(t) {
						e.cellOpacity = t.target.value
					}
				}
			})])]), e._v(" "), s("div", {
				staticStyle: {
					"margin-bottom": "5px",
					display: "flex"
				}
			}, [s("div", {
				staticStyle: {
					flex: "1"
				}
			}, [e._v(e._s(e.replaySecond.toFixed(1)) + " seconds")]), e._v(" "), s("div", {
				staticStyle: {
					"margin-right": "10px"
				}
			}, [s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.autoHideReplayControls,
					expression: "autoHideReplayControls"
				}],
				attrs: {
					type: "checkbox",
					id: "replay-auto-hide-controls"
				},
				domProps: {
					checked: Array.isArray(e.autoHideReplayControls) ? e._i(e.autoHideReplayControls, null) > -1 : e.autoHideReplayControls
				},
				on: {
					change: [function(t) {
						var s = e.autoHideReplayControls,
							a = t.target,
							n = a.checked ? true : false;
						if (Array.isArray(s)) {
							var o = null,
								i = e._i(s, o);
							a.checked ? i < 0 && (e.autoHideReplayControls = s.concat([o])) : i > -1 && (e.autoHideReplayControls = s.slice(0, i).concat(s.slice(i + 1)))
						} else e.autoHideReplayControls = n
					}, e.saveAutoHideControls]
				}
			}), e._v(" "), s("label", {
				attrs: {
					for: "replay-auto-hide-controls"
				}
			}, [e._v("Auto Hide Controls")])])]), e._v(" "), s("input", {
				directives: [{
					name: "model",
					rawName: "v-model",
					value: e.rangeIndex,
					expression: "rangeIndex"
				}],
				staticClass: "replay-slider",
				attrs: {
					type: "range",
					min: e.rangeMin,
					max: e.rangeMax
				},
				domProps: {
					value: e.rangeIndex
				},
				on: {
					input: e.onSlide,
					change: e.onSlideEnd,
					__r: function(t) {
						e.rangeIndex = t.target.value
					}
				}
			})]) : e._e()
		};
	us._withStripped = true;
	var ms = d(1),
		hs = d(258),
		gs = Object(t.a)({
			"data"() {
				return {
					show: false,
					autoHideReplayControls: ms.settings.autoHideReplayControls,
					drawDelay: ms.settings.drawDelay,
					cellOpacity: 100,
					rangeMin: 0,
					rangeIndex: 0,
					rangeMax: 1000,
					replaySecond: 0,
					packetCount: 0
				}
			},
			created: function() {
				ms.events.$on("show-replay-controls", this.onShow), ms.events.$on("replay-index-change", this.onReplayIndexChange)
			},
			methods: {
				"onShow"(e) {
					e ? (this.show = true, this.packetCount = e) : (this.show = false, this.cellOpacity = 100, this.rangeIndex = 0, this.packetCount = 0)
				},
				"onReplayIndexChange"(e, t = true) {
					var s = e / this.packetCount;
					if (t) this.rangeIndex = Math.floor(s * this.rangeMax);
					this.replaySecond = e / 25
				},
				"onSlide"() {
					ms.moveInterval && (clearInterval(ms.moveInterval), ms.moveInterval = null);
					var e = Math.floor(this.rangeIndex / this.rangeMax * (this.packetCount - 1));
					ms.playback.seek(e), this.onReplayIndexChange(e, false)
				},
				"onSlideEnd"() {
					if (!ms.moveInterval) ms.moveInterval = setInterval(ms.playback.next.bind(ms.playback), 40)
				},
				"onCellOpacitySlide"() {
					ms.scene.foreground.alpha = this.cellOpacity / 100
				},
				"saveAutoHideControls"() {
					ms.settings.set("autoHideReplayControls", this.autoHideReplayControls)
				}
			}
		}, us, [], false, null, "c2c2ac08", null);
	gs.options.__file = "src/components/replay-controls.vue";
	var vs = gs.exports,
		fs = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e.show ? s("div", {
				attrs: {
					id: "ab-overlay"
				}
			}, [e._m(0)]) : e._e()
		};
	fs._withStripped = true;
	var ys = d(19),
		{
			isFirstVisit: ws
		} = d(17),
		_s = d(260),
		Cs = Object(t.a)({
			"data"() {
				return {
					show: false
				}
			},
			"created"() {
				if (ws) return;
				/*ys.get("/ads.css").then(() => {})["catch"](e => {
					if (!e.response) this.show = true
				})*/
			}
		}, fs, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "content"
			}, [s("img", {
				staticStyle: {
					width: "120px"
				},
				attrs: {
					src: "/img/sad.png"
				}
			}), e._v(" "), s("p", {
				staticStyle: {
					"font-size": "3em"
				}
			}, [e._v("Adblock Detected")]), e._v(" "), s("p", {
				staticStyle: {
					"font-size": "1.5em",
					"margin-bottom": "15px"
				}
			}, [e._v("We use advertisements to fund our servers!")]), e._v(" "), s("img", {
				staticStyle: {
					"border-radius": "4px",
					"box-shadow": "0 0 10px black"
				},
				attrs: {
					src: "/img/ab.gif"
				}
			})])
		}], false, null, "1611deb4", null);
	Cs.options.__file = "src/components/ab-overlay.vue";
	var ks = Cs.exports,
		bs = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				directives: [{
					name: "show",
					rawName: "v-show",
					value: e.show,
					expression: "show"
				}],
				staticClass: "image-captcha-overlay"
			}, [e._m(0)])
		};
	bs._withStripped = true;
	var xs = d(1),
		Swal = d(4),
		Ss = d(25);
	var Ms = d(262),
		Ts = Object(t.a)({
			"data"() {
				return {
					show: false,
					debounce: false, // previously 'scriptLoadedPromise'
					captchaId: null,
					wsId: null
				}
			},
			"created"() {
				xs.events.$on("show-image-captcha", async () => {
					this.show = true;
					this.wsId = xs.currentWsId;

					if (!this.debounce) {
						this.debounce = true;

						await (new Promise(loaded => {
							if (window.grecaptcha) return void loaded();

							const node = document.createElement('script');
							node.setAttribute('src', 'https://www.google.com/recaptcha/api.js?render=explicit');
							node.setAttribute('async', 'async');
							node.setAttribute('defer', 'defer');
							node.onload = loaded;
							node.onerror = () => {
								Swal.toast.fire({
									type: 'error',
									title: 'Captcha library failed to load. Try refreshing browser in 30 seconds',
									timer: 3000
								});
							};

							document.head.appendChild(node);
						}));
					}

					grecaptcha.ready(() => this.renderCaptcha());
				})
			},
			methods: {
				"renderCaptcha"() {
					if (this.captchaId !== null) {
						grecaptcha.reset(this.captchaId);
						return
					}
					this.captchaId = grecaptcha.render(document.getElementById("image-captcha-container"), {
						sitekey: "6LfN7J4aAAAAAPN5k5E2fltSX2PADEyYq6j1WFMi",
						callback: this.onCaptchaToken.bind(this)
					})
				},
				"onCaptchaToken"(e) {
					if (xs.currentWsId !== this.wsId) {
						this.show = false;
						return
					}
					if (!e) {
						this.renderCaptcha();
						return
					}
					xs.connection.sendRecaptchaToken(e), this.show = false
				}
			}
		}, bs, [function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return s("div", {
				staticClass: "center-screen"
			}, [s("div", {
				staticStyle: {
					color: "orange",
					"margin-bottom": "6px"
				}
			}, [e._v("Login and level up to skip captcha!")]), e._v(" "), s("div", {
				attrs: {
					id: "image-captcha-container"
				}
			})])
		}], false, null, "76d60428", null);
	Ts.options.__file = "src/components/image-captcha.vue";
	var Ps = Ts.exports,
		Is = function() {
			var e = this,
				t = e.$createElement,
				s = e._self._c || t;
			return e.show ? s("div", {
				staticClass: "shoutbox"
			}, [s("iframe", {
				staticClass: "shoutbox-player",
				attrs: {
					width: "300",
					height: "200",
					src: e.url,
					frameborder: "0"
				}
			}), e._v(" "), s("i", {
				staticClass: "fas fa-times close-button",
				on: {
					click: function() {
						return e.hide()
					}
				}
			})]) : e._e()
		};
	Is._withStripped = true;
	var Ls = d(264),
		Es = d(265),
		Us = Object(t.a)({
			"data"() {
				return {
					show: false
				}
			},
			props: ["url", "tag"],
			methods: {
				"hide"() {
					Ls.setSeen(this.tag), this.show = false
				}
			},
			"created"() {
				if (!Ls.isSeen(this.tag)) this.show = true
			}
		}, Is, [], false, null, "559d1d3c", null);
	Us.options.__file = "src/components/shoutbox.vue";
	var Rs = Us.exports;
	m.a.use(c.a);
	var As = d(4),
		Ds = d(1);
	m.a.component("btn", ps), Ds.app = new m.a({
		el: "#app",
		data: {
			showHud: As.showHud,
			showMenu: true,
			showDeathScreen: false,
			deathStats: null
		},
		components: {
			imageCaptcha: Ps,
			mainContainer: pt,
			socialLinks: gt,
			privacyTos: wt,
			contextMenu: St,
			hud: ts,
			deathStats: rs,
			replayControls: vs,
			abOverlay: ks,
			shoutbox: Rs
		}
	})
}]);
