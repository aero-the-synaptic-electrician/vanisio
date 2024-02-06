import {clampNumber, logEvent} from '../game/utils';
import settings from '@/game/settings';
import {circleManager} from '@/renderer/texture-managers';

import * as PIXI from 'pixi.js';

// List of cells being destroyed
export let destroyedCells = new Set<Cell>();

// List of all active cells (excluding cells that are being destroyed)
export let activeCells = new Map<number, Cell>();

// Queue of every cell (including cells being destroyed)
// export const allCells = new Set<Cell>();

export default class Cell {
    public texture: PIXI.Texture;
    public sprite: PIXI.Sprite;

    public type: number;

    public id: number;
    
    public x: number;
    public ox: number;
    public nx: number;

    public y: number;
    public oy: number;
    public ny: number;

    public size: number;
    public oSize: number;
    public nSize: number;

    public flags: number;

    public scale: number = 1;

    public updateStamp: number = 0;

    public destroyed: boolean = false;

    onUpdate?(): void;

    onDestroy?(): void;

    constructor(
        id: number, 
        texture: PIXI.Texture, 
        x: number, 
        y: number, 
        size: number, 
        flags: number
    ) {
        this.id = id || 0;

        this.texture = texture || circleManager.get(0);

        let sprite = this.sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        (sprite as any).gameData = this;
        
        this.nx = this.ox = this.x = sprite.position.x = x;        
        this.ny = this.oy = this.y = sprite.position.y = y;        
        this.nSize = this.oSize = this.size = size;

        this.flags = flags;
    }

    update(now: number) {
        const elapsedTime = (now - this.updateStamp);
        let lerpScale = clampNumber(elapsedTime / settings.get('drawDelay') as number, 0, 1);
        this.x = lerpScale * this.scale * (this.nx - this.ox) + this.ox;
        this.y = lerpScale * this.scale * (this.ny - this.oy) + this.oy;
        let newScale = (this.size = lerpScale * (this.nSize - this.oSize) + this.oSize) * 2;
        if (this.sprite == null || (this.texture as any).clearedFromCache === true) return true;
        let {sprite} = this;
        let {position:sp} = sprite;
        const condition = sp.x !== this.x || sp.y !== this.y || sprite.width !== newScale;
        if (!condition) return true;
        sp.x = this.x;
        sp.y = this.y;
        sprite.width = sprite.height = newScale;
        !!this.onUpdate && this.onUpdate();
        return false;
    }
    
    destroy(animate: boolean = false) {
        if (this.destroyed) {
            return void logEvent(1, `Cell #${this.id} already destroyed!`);
        }
        
        this.destroyed = true;

        !!this.onDestroy && this.onDestroy();

        activeCells.delete(this.id);
        
        if (animate) {
            destroyedCells.add(this);
        } else {
            this.destroySprite();
        }
    }
    
    destroySprite() {
        if (!this.sprite) {
            return void logEvent(1, `Sprite for cell #${this.id} already destroyed!`);
        }

        this.sprite.destroy();
        this.sprite = null;
    }
}