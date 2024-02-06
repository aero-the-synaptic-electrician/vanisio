import gameObject from '@/game';

import * as PIXI from 'pixi.js';

export default class Animator {
    private queue: Set<PIXI.Sprite> = new Set<PIXI.Sprite>();
    
    constructor() {
        const ticker = PIXI.Ticker.shared;
        
        let onTick = (dt: number) => this.animate(dt);

        gameObject.on('game-started', () => {
            ticker.add(onTick);
        });

        gameObject.on('game-stopped', () => {
            ticker.remove(onTick);
        });
    }
    
    animate(dt: number) {
        this.queue.forEach(sprite => {
            const deltaMS = dt / PIXI.settings.TARGET_FPMS;
            const value = sprite.alpha += (deltaMS / 300);
            if (value < 1) return;
            this.queue.delete(sprite);
        });
    }

    add(sprite: PIXI.Sprite) {
        sprite.alpha = 0;
        this.queue.add(sprite);
    }

    remove(sprite: PIXI.Sprite) {
        this.queue.delete(sprite);
    }
};