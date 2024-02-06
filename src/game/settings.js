/** @type {Map<string, Setting>} */
const defaults = new Map([
	['useWebGL', true],
	['gameResolution', 1],
	['smallTextThreshold', 40],
	['autoZoom', false],
	['rememeberEjecting', true],
	['autoRespawn', false],
	['mouseFreezeSoft', true],
	['drawDelay', 120],
	['cameraMoveDelay', 150],
	['cameraZoomDelay', 150],
	['cameraZoomSpeed', 10],
	['replayDuration', 8],
	['showReplaySaved', 2],
	['showNames', 2],
	['showMass', 2],
	['showSkins', 1],
	['showOwnName', true],
	['showOwnMass', true],
	['showOwnSkin', true],
	['showCrown', true],
	['foodVisible', true],
	['eatAnimation', true],
	['showHud', true],
	['showLeaderboard', true],
	['showServerName', false],
	['showChat', true],
	['showChatToast', false],
	['minimapEnabled', true],
	['minimapLocations', true],
	['showFPS', true],
	['showPing', true],
	['showCellCount', true],
	['showPlayerScore', false],
	['showPlayerMass', true],
	['showClock', false],
	['showSessionTime', false],
	['showPlayerCount', false],
	['showSpectators', false],
	['showRestartTiming', false],
	['showBlockedMessageCount', true],
	['filterChatMessages', true],
	['clearChatMessages', true],
	['backgroundColor', '101010'],
	['borderColor', '000000'],
	['foodColor', 'ffffff'],
	['ejectedColor', 'ffa500'],
	['cellNameOutlineColor', '000000'],
	['cursorImageUrl', null],
	['backgroundImageUrl', 'img/background.png'],
	['virusImageUrl', 'img/virus.png'],
	['cellMassColor', 'ffffff'],
	['cellMassOutlineColor', '000000'],
	['cellNameFont', 'Hind Madurai'],
	['cellNameWeight', 1],
	['cellNameOutline', 2],
	['cellNameSmoothOutline', true],
	['cellLongNameThreshold', 750],
	['cellMassFont', "Ubuntu"],
	['cellMassWeight', 2],
	['cellMassOutline', 2],
	['cellMassTextSize', 0],
	['cellMassSmoothOutline', true],
	['shortMass', true],
	['showBackgroundImage', true],
	['backgroundImageRepeat', true],
	['backgroundDefaultIfUnequal', true],
	['backgroundImageOpacity', 0.6],
	['useFoodColor', false],
	['namesEnabled', true],
	['skinsEnabled', true],
	['massEnabled', true],
	['showLocations', false],
	['cellBorderSize', 1],
	['autoHideReplayControls', false],
	['minimapSize', 220],
	['minimapFPS', 30],
	['minimapSmoothing', 0.08]
]);

const getThicknessValue = (thickness, fontSize) => {
    let n;
    switch (thickness) {
        case 3: {
            n = fontSize/5;
            break;
        }

        case 1: {
            n = fontSize/20;
            break;
        }

        default: {
            n = fontSize/10;
            break;
        }
    }

    return Math.ceil(n);
}

/** @param {number} n */
const getWeightString = (n) => (n == 0) ? 'thin' : (n == 2) ? 'bold' : 'normal';

class Settings {
    constructor() {
        /** @type {Map<string, Setting>} */
        const storage = this.storage = new Map();

        /** @type {Object.<string, Setting>} */
        const userSettings = this.userDefinedSettings = this.loadUserDefinedSettings();
        /** @type {string} */
        let n;
        for (n in userSettings) {
            const v = userSettings[n];
            storage.set(n, this[n] = v);
        }

        // contribute default values for missing settings

        defaults.forEach((v, n) => {
            if (!storage.has(n)) {
                storage.set(n, this[n] = v);
            }
        });
                
        this.set('skinsEnabled', true);
        this.set('namesEnabled', true);
        this.set('massEnabled', true);
        
        this.cellSize = 512;

        this.compileNameFontStyle();
        this.compileMassFontStyle();
    }

    compileNameFontStyle() {
        const style = {
            fontFamily: this.cellNameFont,
            fontSize: 80,
            fontWeight: getWeightString(this.cellNameWeight)
        };

        if (!!this.cellNameOutline) {
            style.stroke = parseInt(this.cellNameOutlineColor, 16);
            style.strokeThickness = getThicknessValue(this.cellMassOutline, style.fontSize);
            style.lineJoin = this.cellMassSmoothOutline ? 'round' : 'miter'
        }
        
        this.nameTextStyle = style;
    }

    compileMassFontStyle() {
        const style = {
            fontFamily: this.cellMassFont,
            fontSize: 56 + 20 * this.cellMassTextSize,
            fontWeight: getWeightString(this.cellMassWeigh),
            lineJoin: 'round',
            fill: parseInt(this.cellMassColor, 16)
        };

        if (!!this.cellMassOutline) {
            style.stroke = parseInt(this.cellMassOutlineColor, 16);
            style.strokeThickness = getThicknessValue(this.cellMassOutline, style.fontSize);
            style.lineJoin = this.cellMassSmoothOutline ? 'round' : 'miter';
        }
        
        this.massTextStyle = style;
    }
    
    /**
     * @param {string} name 
     * @returns {Setting?}
     */
    getDefault(name) { 
        return defaults.has(name) ? defaults.get(name) : null; 
    }

    /** @returns {Object.<string, Setting>} */
    loadUserDefinedSettings() {
        if (!('settings' in localStorage)) return {};
        try {
            return JSON.parse(localStorage.getItem('settings'));
        } catch (e) {
            return {};
        }
    }

    /**
     * @param {string} name
     * @returns {boolean} 
     */
    has(name) {
        const {storage} = this;
        return storage.has(name);
    }

    /**
     * @param {string} name 
     * @returns {Setting?}
     */
    get(name) {
        const {storage} = this;
        return storage.has(name) ? storage.get(name) : null;
    }

    /**
     * @param {string} name 
     * @param {string|number|boolean} value 
     * @returns {boolean}
     */
    set(name, value) {
        const {storage} = this;
        if (storage.has(name) && storage.get(name) === value) return false;        
        storage.set(name, this[name] = value);
        this.userDefinedSettings[name] = value;
        localStorage.setItem('settings', JSON.stringify(this.userDefinedSettings));
        return true;
    }
};

// Singleton instance.
const settings = global.settings = new Settings();
export default settings;