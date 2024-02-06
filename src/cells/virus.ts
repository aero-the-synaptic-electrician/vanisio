import Cell from './cell';
import {virusTexture} from '@/renderer/texture-managers';

import * as PIXI from 'pixi.js';

export default class Virus extends Cell {
    isVirus: boolean;

    constructor(
        id: number, 
        x: number, 
        y: number, 
        size: number, 
        flags: number
    ) {
        const texture = virusTexture.get();
        super(id, texture, x, y, size, flags);
    }

    resetTexture() {
        this.destroySprite();
        this.texture = virusTexture.get();
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.anchor.set(0.5);
        (this.sprite as any).gameData = this;
    }
};

Virus.prototype.type = 2;

Virus.prototype.isVirus = true;