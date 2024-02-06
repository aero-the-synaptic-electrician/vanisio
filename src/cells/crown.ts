import Cell from './cell';

import * as PIXI from 'pixi.js';

export default class Crown extends Cell {
    isCrown: boolean;
    
    constructor(
        id: number, 
        x: number,
        y: number, 
        size: number, 
        flags: number
    ) {
        const texture = PIXI.Texture.from('/img/crown.png');
        super(id, texture, x, y, size, flags);
        this.sprite.alpha = 0.7;
    }
}

Crown.prototype.type = 6;

Crown.prototype.isCrown = true;