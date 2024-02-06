import renderer from '@/renderer';
import settings from '../game/settings';
import {logEvent} from '../game/utils';

import * as PIXI from 'pixi.js';

abstract class BaseManager { 
    public cache: Map<number, PIXI.RenderTexture>;

    public size: number;

    public factoredSize: number;

    constructor() {
        this.cache = new Map<number, PIXI.RenderTexture>();

        this.factoredSize = (this.size = settings.cellSize) / 2;
    }
    
    abstract get(color: number, render?: boolean): PIXI.RenderTexture;

    reset() {
        this.cache.forEach((t) => t.destroy(true));
        this.cache.clear();
    }
};

class CircleManager extends BaseManager {
    /** 
     * @param {number} color
     * @param {boolean} [render=true]
     * @returns {PIXI.RenderTexture}
     */
    get(color: number, render: boolean = true): PIXI.RenderTexture {
        let {cache} = this;
        if (cache.has(color)) {
            return cache.get(color);
        } else {
            let {factoredSize, size} = this;

            let graphic = new PIXI.Graphics()
                .beginFill(color)
                .drawCircle(0, 0, factoredSize)
                .endFill();

            graphic.position.set(factoredSize);

            let texture = PIXI.RenderTexture.create({ width: size, height: size });
            cache.set(color, texture);

            if (!!render) {
                renderer.render(graphic, texture);
            }
            
            return texture;
        }
    }
};

class SquareManager extends BaseManager {
    /** 
     * @param {number} color 
     * @returns {PIXI.RenderTexture}
     */
    get(color: number, render: boolean = true): PIXI.RenderTexture {
        let {cache} = this;
        if (cache.has(color)) {
            return cache.get(color);
        } else {
            let {factoredSize, size} = this;

            let graphic = new PIXI.Graphics()
                .beginFill(color)
                .drawRect(-factoredSize, -factoredSize, factoredSize*2, factoredSize*2)
                .endFill();

            graphic.position.set(factoredSize);

            let texture = PIXI.RenderTexture.create({width:size, height:size});
            cache.set(color, texture);

            if (!!render) {
                renderer.render(graphic, texture);
            }
            
            return texture;
        }
    }
};

class VirusTexture {
    private loading?: boolean;

    private texture: PIXI.RenderTexture;

    constructor() {
        this.texture = PIXI.RenderTexture.create({width:200, height:200});
    }
    
    async load(url: string) {
        if (!!this.loading) return;

        this.loading = true;
        
        try {
            const texture = await PIXI.Texture.fromURL(url, {width:200,height:200});
            const sprite = PIXI.Sprite.from(texture);
            renderer.render(sprite, this.texture, true);
            logEvent(0, 'Loaded static virus texture');
        } catch (e) {
            logEvent(1, `Failed to load static virus texture (URL=${url})`);
        }
        
        delete this.loading;
    }

    get(): PIXI.RenderTexture { return this.texture; }
};

export let circleManager = global.circleManager = new CircleManager();

export let squareManager = new SquareManager();

export let virusTexture = global.virusTexture = new VirusTexture();