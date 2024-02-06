import gameObject from '@/game';
import settings from '@/game/settings';
import Cell from './cell';
import Player from '@/game/player';
import {logEvent} from '../game/utils';
import {circleManager} from '@/renderer/texture-managers';

import * as PIXI from 'pixi.js';

const createMassText = (style: PIXI.TextStyle): PIXI.BitmapText => {
    let t = new PIXI.BitmapText('', { fontName: 'mass', align: 'right' });
    let s = style.strokeThickness || 0;
    t.position.set(-s/2, -s/2);
    (t.anchor as PIXI.Point).set(0.5, -0.6);
    return t;
}

export default class PlayerCell extends Cell {
    isPlayerCell: boolean;

    pid: number;

    crownSprite: PIXI.Sprite;

    nameSprite: PIXI.Sprite;

    massText: PIXI.BitmapText;

    constructor(
        id: number, 
        x: number, 
        y: number, 
        size: number, 
        flags: number, 
        public player: Player
    ) {
        super(id, player.texture || circleManager.get(0), x, y, size, flags);
        
        this.pid = player.pid;

        if (!!player.isMe) {
            gameObject.ownedCells.add(this);
        }
        
        if (player.hasCrown) {
            this.addCrown();
        }
    }

    addCrown() {
        if (!!this.crownSprite) {
            return logEvent(1, 'addCrown(): crown already exists');
        }

        const pool = gameObject.crownPool;
        
        /** @type {PIXI.Sprite} */
        let sprite;
        if (!!pool.length) {
            sprite = pool.pop();
        } else {
            sprite = PIXI.Sprite.from('/img/crown.png');
            sprite.scale.set(0.7);
            sprite.pivot.set(0, 643);
            sprite.anchor.x = 0.5;
            sprite.rotation = -0.5;
            sprite.alpha = 0.7;
            sprite.zIndex = 2;
        }

        this.crownSprite = sprite;
        this.sprite.addChild(sprite);
    }

    removeCrown() {
        let sprite = this.crownSprite;
        if (!sprite) {
            return logEvent(1, 'removeCrown(): crown doesnt exist');
        }
        this.sprite.removeChild(sprite);
        gameObject.crownPool.push(sprite);
        this.crownSprite = null;
    }

    onUpdate() {
        let scale = gameObject.scene.container.scale.x * this.size * gameObject.renderer.resolution;
        let visible = scale > (settings.get('smallTextThreshold') as number);

        let {player} = this;
            
        if (visible) {
            if (player.massShown && !this.massText) {                
                this.massText = gameObject.massTextPool.pop() || createMassText(gameObject.massTextStyle);
                this.massText.zIndex = 0;
                this.sprite.addChild(this.massText);
            }
        
            if (player.nameShown && !this.nameSprite && !!player.nameSprite) {
                this.nameSprite = new PIXI.Sprite(player.nameSprite.texture);
                this.nameSprite.anchor.set(0.5);
                this.nameSprite.zIndex = 1;
                this.sprite.addChild(this.nameSprite);
            }
        }
        
        if (!!this.crownSprite) {
            this.crownSprite.visible = scale > 16 && (settings.get('showCrown') as boolean);
        }

        if (!!this.nameSprite) {
            this.nameSprite.visible = player.nameShown && visible;
        }
        
        let {massText} = this;
        if (!!massText) {
            if (player.massShown && visible) {
                massText.text = gameObject.getMassText((this.nSize*this.nSize) / 100);
                massText.visible = true;
            } else if (massText.visible) {
                massText.visible = false;
            }
        }
    }

    onDestroy() {
        gameObject.ownedCells.delete(this);
        
        if (!!this.massText) {
            this.sprite.removeChild(this.massText);
            gameObject.massTextPool.push(this.massText);
        }

        if (!!this.crownSprite) {
            this.removeCrown();
        }
    }
};

PlayerCell.prototype.type = 1;

PlayerCell.prototype.isPlayerCell = true;