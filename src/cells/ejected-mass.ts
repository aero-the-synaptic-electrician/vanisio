import gameObject from '@/game';
import settings from '@/game/settings';
import Cell from './cell';
import {circleManager} from '@/renderer/texture-managers';
import {clampNumber} from '@/game/utils';
import Animator from './util/animator';

// animates ejected cells for fade-in transition

let animator = new Animator();

const getOrCreateTexture = () => circleManager.get(parseInt(settings.get('ejectedColor') as string, 16));

export default class EjectedMass extends Cell {
    isEjected: boolean;

    constructor(
        id: number,
        x: number, 
        y: number, 
        size: number, 
        flags: number
    ) {
        const texture = getOrCreateTexture();
        super(id, texture, x, y, size, flags);
        animator.add(this.sprite);
    }
    
    reloadTexture() {
        this.sprite.texture = this.texture = getOrCreateTexture();
    }

    update(now: number) {
        const elapsedTime = (now - this.updateStamp);
        let lerpScale = clampNumber(elapsedTime / settings.get('drawDelay') as number, 0, 1);
        this.x = ((this.nx - this.ox) * lerpScale) + this.ox;
        this.y = ((this.ny - this.oy) * lerpScale) + this.oy;
        let factoredScale = (this.size = this.nSize) * 2;
        let {sprite} = this;
        if (sprite == null) return true;
        let {position:sp} = sprite;
        const {x:sx, y:sy} = sp;
        if (sx === this.x && sy === this.y && sprite.width === factoredScale) return true;
        sp.x = this.x;
        sp.y = this.y;
        sprite.width = sprite.height = factoredScale;
        return false;
    }

    onDestroy() {
        if (!!this.sprite) {
            animator.remove(this.sprite);
        }
    }
};

EjectedMass.prototype.type = 3;

EjectedMass.prototype.isEjected = true;