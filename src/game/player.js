import gameObject from '.';
import renderer from '@/renderer';
import settings from './settings';
import {basic, basicd} from '@/cells/colors';
import {activeCells} from '@/cells/cell';
import {logEvent} from './utils';

import * as PIXI from 'pixi.js';
import { PlayerCell } from '@/cells';

const circleSize = settings.cellSize;;
const borderSize = settings.cellBorderSize;

/** 
 * @param {number?} color
 * @returns {PIXI.Graphics}
 **/
const getCellGraphic = (color) => {
    color = color || 0;

    const g = new PIXI.Graphics()
        .lineStyle(borderSize, 0, 0.5)
        .beginFill(color)
        .drawCircle(0, 0, circleSize/2)
        .endFill();

    return g;
}

// Preload the skin background graphic (instead of creating multiple objects)
const maskGraphic = getCellGraphic(0);

export default class Player {
    /**
     * @param {number} pid 
     * @param {boolean} bot 
     */
    constructor(pid, bot) {
        /** @type {number} */
        this.pid = pid;

        /** @type {boolean} */
        this.bot = bot;
        
        /** @type {string?} */
        this.skinUrl = null;
        
        /** @type {number?} */
        this.tagId = null;

        /** @type {boolean|undefined} */
        this.isMe;

        if (pid == gameObject.playerId) this.isMe = true;

        /** @type {PIXI.RenderTexture} */
        this.texture = PIXI.RenderTexture.create(circleSize, circleSize);

        /** @type {PIXI.Container} */
        this.cellContainer = this.createCellContainer();

        this.renderCell();
        
        /** @type {boolean} */
        this.hasCrown;

        /** @type {string?} */
        this.nameFromServer;

        /** @type {string?} */
        this.nameColorFromServer;
    }

    get visibility() { return 2 - +(gameObject.tagId === this.tagId); }
    
    setOutline(color) {
        color = color || 0;
        this.outlineColor = e;
        const scaledSize = circleSize/2;
        const g = new PIXI.Graphics()
        .lineStyle(20, color, 1)
        .drawCircle(0, 0, scaledSize - 9.5)
        .endFill();
        g.pivot.set(-scaledSize);
        renderer.render(g, this.texture, false);
    }


    /** @param {boolean} tate */
    setCrown(state) {
        this.hasCrown = state;

        activeCells.forEach((cell) => {
            if (cell.pid !== this.pid) return;
            /** @type {PlayerCell} */
            let playerCell = cell;
            if (state) {
                playerCell.addCrown();
            } else {
                playerCell.removeCrown();
            }
        });
    }

    /** @returns {PIXI.Container} */
    createCellContainer() {
        const container = new PIXI.Container();
        container.pivot.set(-circleSize / 2);        
        container.addChild(getCellGraphic(this.getCellColor()));
        return container;
    }

    /**
     * @param {ImageBitmap} image 
     * @returns {PIXI.Sprite}
     */
    createSkinSprite(image) {
        const baseTexture  = new PIXI.BaseTexture(image);
        const texture = new PIXI.Texture(baseTexture);
        const sprite = new PIXI.Sprite(texture);
        sprite.width = sprite.height = circleSize;
        sprite.anchor.set(0.5);
        return sprite;
    }

    renderCell() {
        console.assert(this.cellContainer.children.length <= 3, 'cellContainer has unexpected sprites');

        renderer.render(this.cellContainer, this.texture, true);
        
        if (this.outlineColor) {
            this.setOutline(this.outlineColor);
        }
    }

    /**
     * @param {number?} id 
     * @returns {boolean}
     */
    setTagId(id) {
        id = id || null;
        if (this.tagId === id) return false;
        this.tagId = id;
        return true;
    }
    
    /** @param {string?} [color] */
    setNameColor(color) {
        color = !!color ? parseInt(color, 16) : null;
        this.nameColor = color;
        this.nameColorCss = color && ('#' + color.toString(16)); // TOOD: possibly "'#' + oldColor"
        return color;
    }

    /**
     * 
     * @param {string?} name 
     * @param {number?} nameColor 
     */
    setName(name, nameColor) {
        name = name || 'Unnamed';
        if (this.nameFromServer === name && this.nameColorFromServer === nameColor) return false;
        this.nameFromServer = name;
        this.nameColorFromServer = nameColor;
        this.applyNameToSprite();
        return true;
    }

    applyNameToSprite() {
        let noName = this.nameFromServer === 'Unnamed';
        let longName = this.nameFromServer === 'Long Name';
        let name = noName ? '' : this.nameFromServer;

        const lastName = this.name;
        const lastNameColor = this.nameColor;

        /** @type {number?} */
        let nameColor;

        if (!noName && !longName) {
            nameColor = this.setNameColor(this.nameColorFromServer);
        } else {
            nameColor = this.setNameColor(null);
        }

        this.setNameSprite(name, nameColor);

        if (!noName && !longName && this.nameSprite.texture.width > settings.cellLongNameThreshold) {
            longName = true;
            name = 'Long Name';

            nameColor = this.setNameColor(null);
            this.setNameSprite(name, nameColor);
        }

        this.name = noName ? 'Unnamed' : name;

        if (lastName !== this.name || lastNameColor !== this.nameColor) {
            const color = nameColor || (this.isMe ? 0xff8c00 : null);
            gameObject.emit('minimap-create-node', this.pid, name, nameColor, color);
        }
    }

    /**
     * @param {string} name 
     * @param {number?} nameColor 
     */
    setNameSprite(name, nameColor) {
        if (!!this.nameSprite) {
            this.nameSprite.text = name;
        } else {
            this.nameSprite = new PIXI.Text(name, gameObject.nameTextStyle);
        }        
        this.nameSprite.style.fill = nameColor || 0xffffff;
        this.nameSprite.updateText();
    }
    
    /** @param {string?} url */
    setSkin(url) {
        url = url || null;
        if (url === this.skinUrl) return false;
        this.abortSkinLoaderIfExist();
        const invalidate = this.destroySkin();
        if (invalidate) this.renderCell();
        this.skinUrl = url;
        if (this.skinShown) {
            this.loadSkinAndRender();
        }
        return true;
    }
    
    destroySkin() {
        if (!this.skinSprite) return false;
        this.skinSprite.mask = null; // .destroy(true);
        this.skinSprite.destroy(true);
        this.skinSprite = null;
        return true;
    }
    
    loadSkinAndRender() {
        if (!!this.abortSkinLoader) {
            logEvent(1, 'loadSkinAndRender() called while other skin was loading');
        }
        this.abortSkinLoaderIfExist();
        this.abortSkinLoader = gameObject.skinLoader.loadSkin(this.skinUrl, (image) => {
            this.skinSprite = this.createSkinSprite(image);
            this.skinSprite.mask = maskGraphic;
            this.cellContainer.addChild(this.skinSprite.mask, this.skinSprite);
            this.renderCell();
        });
    }
    
    invalidateVisibility() {
        let nameState = settings.namesEnabled;
        let skinState = settings.skinsEnabled;
        let massState = settings.massEnabled;

        if (!this.isMe) {
            nameState = settings.showNames >= this.visibility;
            skinState = settings.showSkins >= this.visibility;
            massState = settings.showMass >= this.visibility;
        } else {
            nameState = settings.showOwnName;
            skinState = settings.showOwnSkin;
            massState = settings.showOwnMass;
        }
        
        nameState = settings.namesEnabled && nameState;
        skinState = settings.skinsEnabled && skinState;
        massState = settings.massEnabled && massState;
        
        if (skinState && !this.skinShown) {
            if (!!this.skinSprite) {
                this.skinSprite.visible = true;
                this.renderCell();
            } else if (!!this.skinUrl) {
                this.loadSkinAndRender();
            }
        } else if (!skinState && this.skinShown) {
            this.abortSkinLoaderIfExist();
            
            if (!!this.skinSprite) {
                this.skinSprite.visible = false;
                this.renderCell();
            }
        }

        /** @type {boolean} */
        this.nameShown = nameState;

        /** @type {boolean} */
        this.skinShown = skinState;

        /** @type {boolean} */
        this.massShown = massState;

        /** @type {boolean} */
        this.nameColorShown = settings.showNameColor;
    } 
    
    abortSkinLoaderIfExist() {
        if (!this.abortSkinLoader) return;
        this.abortSkinLoader();
        this.abortSkinLoader = null;
    }
    
    getCellColor() {
        const seed = gameObject.seededRandom(this.pid);
        const index = Math.floor(seed * (this.bot ? basicd : basic).length);
        return (this.bot ? basicd : basic)[index];
    }
    
    destroy() {
        this.abortSkinLoaderIfExist();
        this.destroySkin();

        this.cellContainer.removeChild(maskGraphic);
        this.cellContainer.destroy(true);
        this.cellContainer = null;

        this.texture.destroy(true);
        this.texture.clearedFromCache = true;
        this.texture = null;

        if (!!this.nameSprite) {
            this.nameSprite.destroy(true);
            this.nameSprite = null;
        }

        gameObject.emit('minimap-destroy-node', this.pid);

        this.destroyed = true;
    }
};

Player.prototype.destroyed = false;