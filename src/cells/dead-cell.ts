import Cell from './cell';

import {circleManager, squareManager} from '@/renderer/texture-managers';

export default class DeadCell extends Cell {
    isDead: boolean;
    
    constructor(
        id: number, 
        x: number, 
        y: number, 
        size: number, 
        flags: number, 
        circle: boolean = true, 
        color: number = 0x404040
    ) {
        const texture = (circle ? circleManager : squareManager).get(color);
        super(id, texture, x, y, size, flags);
        this.sprite.alpha = 0.5;
    }
};

DeadCell.prototype.type = 5;

DeadCell.prototype.isDead = true;