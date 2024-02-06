import Cell from './cell';

import * as PIXI from 'pixi.js';

require('@/images/coin.png');

export default class Coin extends Cell {
    isCoin: boolean;

    constructor(
        id: number, 
        x: number, 
        y: number, 
        size: number, 
        flags: number
    ) {
        const texture = PIXI.Texture.from('/img/coin.png');
        super(id, texture, x, y, size, flags);
    }
};

Coin.prototype.type = 9;

Coin.prototype.isCoin = true;