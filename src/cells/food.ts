import {circleManager} from '@/renderer/texture-managers';
import {neon} from './colors';
import Cell from './cell';
import settings from '@/game/settings';

const getOrCreateTexture = (id: number): PIXI.RenderTexture => circleManager.get(settings.get('useFoodColor') as boolean ? parseInt(settings.get('foodColor') as string, 16) : neon[id % neon.length])

export default class Food extends Cell {
    isFood: boolean;
    
    constructor(
        id: number, 
        x: number, 
        y: number, 
        size: number, 
        flags: number
    ) {
        const texture = getOrCreateTexture(id);
        super(id, texture, x, y, size, flags);
    }

    reloadTexture() {
        this.sprite.texture = this.texture = getOrCreateTexture(this.id);
    }

    update() {
        this.x = this.nx;
        this.y = this.ny;
        let factoredScale = (this.size = this.nSize) * 2;
        if (this.sprite == null) return true;
        let {sprite} = this;
        let {position} = sprite;
        const {x:sx, y:sy} = position;
        if (sx === this.x && sy === this.y && sprite.width === factoredScale) return true;
        position.x = this.x;
        position.y = this.y;
        sprite.width = sprite.height = factoredScale;
        return false;
    }
};

Food.prototype.type = 4;

Food.prototype.isFood = true;