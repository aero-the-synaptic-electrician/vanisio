import gameObject from '.';
import settings from './settings';
import gameState from './state';
import {logEvent} from './utils';

// TODO: remove when actionmanager is added
/** @type {Map<string, function>} */
const handlers = new Map([
	['toggleAutoRespawn', () => {
        const state = settings.autoRespawn;
        settings.set('autoRespawn', !state);
        if (state && gameState.isAutoRespawning) {
            gameObject.triggerDeathDelay(true);
        }
        Swal.toast.fire({
            title: `Auto respawn ${state ? 'disabled' : 'enabled'}`,
            type: 'info',
            timer: 1500
        });
	}],
	['respawn', () => {
		if (gameState.deathDelay || gameState.playButtonDisabled) return;
        actionManager.join();
        gameObject.showMenu(false);
	}],
	['feed', actionManager.feed.bind(actionManager)],
    ['feedMacro', actionManager.feed.bind(actionManager, true)],
	['split', actionManager.split.bind(actionManager, 1)],
	['splitx2', () => actionManager.split(2, settings.delayDoublesplit ? 40 : 0)],
	['splitx3', actionManager.split.bind(actionManager, 3)],
	['splitMax', actionManager.split.bind(actionManager, 4)],
	['split32', actionManager.split.bind(actionManager, 5)],
	['split64', actionManager.split.bind(actionManager, 6)],
	['split128', actionManager.split.bind(actionManager, 7)],
	['split256', actionManager.split.bind(actionManager, 8)],
	['linesplit', actionManager.linesplit.bind(actionManager)],
	['freezeMouse', actionManager.freezeMouse.bind(actionManager)],
	['lockLinesplit', actionManager.lockLinesplit.bind(actionManager)],
	['stopMovement', actionManager.stopMovement.bind(actionManager)],
	['toggleSkins', actionManager.toggleSkins.bind(actionManager)],
	['toggleNames', actionManager.toggleNames.bind(actionManager)],
	['toggleFood', actionManager.toggleFood.bind(actionManager)],
	['toggleMass', actionManager.toggleMass.bind(actionManager)],
	['toggleChat', actionManager.toggleChat.bind(actionManager)],
	['toggleChatToast', actionManager.toggleChatToast.bind(actionManager)],
	['toggleHud', actionManager.toggleHud.bind(actionManager)],
	['spectateLock', actionManager.spectateLockToggle.bind(actionManager)],
	// ['spectatePlayer', actionManager.spectatePlayer],
	// ['selectPlayer', actionManager.selectPlayer],
	// ['saveReplay', gameObject.replay.save],
	['zoomLevel1', actionManager.setZoomLevel.bind(actionManager, 1)],
	['zoomLevel2', actionManager.setZoomLevel.bind(actionManager, 2)],
	['zoomLevel3', actionManager.setZoomLevel.bind(actionManager, 3)],
	['zoomLevel4', actionManager.setZoomLevel.bind(actionManager, 4)],
	['zoomLevel5', actionManager.setZoomLevel.bind(actionManager, 5)]
	// ['switchMultibox', actionManager.switchMultibox]
]);

const defaultKeys = {
	feed: 'W',
	feedMacro: 'MOUSE0',
	split: 'SPACE',
	splitx2: 'G',
	splitx3: 'H',
	splitMax: 'T',
	split32: '',
	split64: '',
	linesplit: 'Z',
	lockLinesplit: '',
	respawn: '',
	toggleAutoRespawn: '',
	stopMovement: '',
	toggleSkins: '',
	toggleNames: '',
	toggleMass: '',
	spectateLock: 'Q',
	selectPlayer: 'MOUSE1',
	saveReplay: 'R',
	toggleChat: '',
	toggleChatToast: '',
	toggleHud: '',
	zoomLevel1: '1',
	zoomLevel2: '2',
	zoomLevel3: '3',
	zoomLevel4: '4',
	zoomLevel5: '5',
	switchMultibox: ''
};

export class Input {
	constructor() {
        /** @type {number} */
		this.version = 2;
        
        /** @type {Map<string, function>} */
        this.pressed = new Map();
        
        /** @type {Map<string, function>} */
        this.released = new Map();

        this.hotkeys = null;

        this.resetObsoleteHotkeys();
        this.load();
	}

	resetObsoleteHotkeys() {
        if (+localStorage.getItem('hotkeysVersion') === this.version) return;
		localStorage.setItem('hotkeysVersion', this.version);
		if (!!localStorage.getItem('hotkeys')) {
            localStorage.removeItem('hotkeys');
        }
	}

	load() {
        try {
            /** @type {Object.<string, string>} */
            const keys = JSON.parse(localStorage.getItem('hotkeys'));
            if (typeof keys !== 'object') {
                throw new Error('Parsing hotkeys failed, opting to defaults');
            }

            for (const key in defaultKeys) {
                if (key in keys) continue;
                keys[key] = defaultKeys[key];
            }

            this.hotkeys = keys;
        } catch (e) {
            logEvent(2, typeof e == 'string' ? e : (e && e.message) || 'Error occurred while parsing hotkeys');
            this.hotkeys = {...defaultKeys};
        }

        this.loadHandlers(this.hotkeys);
	}

	save() {
		localStorage.setItem('hotkeys', JSON.stringify(this.hotkeys));
	}

	reset() {
        localStorage.removeItem('hotkeys');
        this.load();
        return this.hotkeys;
	}

	get() { return this.hotkeys; }

    /**
     * @param {string} name 
     * @param {string} key 
     * @returns {boolean} 
     */
	set(name, key) {
        if (!handlers.has(name)) return false;
        if (this.hotkeys[name] === key) return true;
        if (!!key) {
            for (const entry of Object.entries(this.hotkeys)) {
                if (entry[1] === key) {
                    this.hotkeys[entry[0]] = '';
                }
            }
        }
        this.hotkeys[name] = key;
        this.save();
        this.loadHandlers(this.hotkeys);
        return true;
	}

	loadHandlers(keys) {
		this.pressed.clear();
        
        for (const key in keys) {
            if (!handlers.has(key)) {
                logEvent(1, `Invalid handler name '${key}' in hotkeys`);
                continue;
            }
            const name = keys[key];
            const handler = handlers.get(key);
            this.pressed.set(name, handler);            
        }
        
        this.released.clear();

        if ('feedMacro' in keys) {
            this.released.set(keys.feedMacro, actionManager.feed.bind(actionManager, false));
        }
	}
    
    /** 
     * @param {string} key 
     * @returns {boolean}
     */
    press(key) {
        if (!this.pressed.has(key)) return false;
        const handler = this.pressed.get(key);
        handler();
        return true;
    }

    /** @param {string} key */
	release(key) {
        if (!this.released.has(key)) return;
        const handler = this.released.get(key);
        handler();
	}

    /**
     * @param {string} key 
     * @returns {string}
     */
	convertKey(key) {
		if (!key) return 'Unknown';
		return key.toString().toUpperCase().replace(/^(LEFT|RIGHT|NUMPAD|DIGIT|KEY)/, '');
	}
}

// Singleton instance.
const inputManager = new Input();
export default inputManager;