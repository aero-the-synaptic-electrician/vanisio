import {PlayerCell} from '@/cells';
import {activeCells} from '@/cells/cell';
import settings from '@/game/settings';

import * as PIXI from 'pixi.js';

/**
 * @param {Border} data 
 * @returns {PIXI.Graphics}
 */
const createBorderGraphic = (border: Border) => {
    const color = parseInt(settings.get('borderColor') as string, 16);
    let {width, height} = border;
    let g = new PIXI.Graphics();
    g.lineStyle(100, color, 1, 0.5)
    if (!border.circle) {
        g.drawRect(0, 0, width, height);
    } else {
        g.drawEllipse(width/2, height/2, width/2, height/2);
    }
    g.endFill();
    g.pivot.set(width/2, height/2);
    return g;
}

export default class Scene {
    public game: Game;

    public border: Border;

    public container: PIXI.Container;

    public background: PIXI.Container;

    public foreground: PIXI.Container; 

    public food: PIXI.Container;

    public backgroundSprite: PIXI.Sprite;
    
    public borderGraphic: PIXI.Graphics;
    
    /** 
     * @param {Game} game
     * @param {Border} data 
     */
    constructor(game: Game, border: Border) {        
        this.game = game;

        this.border = border;

        this.container = new PIXI.Container();
        
        this.background = new PIXI.Container();

        this.foreground = new PIXI.Container();

        this.food = new PIXI.Container();        
        this.food.visible = settings.get('foodVisible') as boolean;
        
        this.backgroundSprite = null;

        this.borderGraphic = createBorderGraphic(border);
        this.background.addChild(this.borderGraphic);

        this.container.addChild(this.background, this.food, this.foreground);
        
        this.resetMassTextStyle(false);

        this.setPosition();

		const showBackground = PIXI.utils.isWebGLSupported() && settings.get('useWebGL') && settings.get('showBackgroundImage');
        if (showBackground) {
            this.setBackgroundImage();
        }

        this.background.position.x = border.x;
        this.background.position.y = border.y;
    }

    setPosition() {
        const {container} = this;
        container.position.x = window.innerWidth/2;
        container.position.y = window.innerHeight/2;
    }

    sort() {
        let p: string;
        this.foreground.children.sort((a, b) => (p = (a=(a as any).gameData).size === (b=(b as any).gameData).size ? 'id' : 'size', a[p] - b[p]));
    }

    addCell(o) { this.foreground.addChild(o); }

    addFood(o) { this.food.addChild(o); }

    setBackgroundImage() {
        let url = settings.get('backgroundImageUrl') as string;

        if (!url) {
            this.destroyBackgroundImage();
            return;
        }

        let {border} = this;

        let sprite = (settings.get('backgroundImageRepeat') ? PIXI.TilingSprite : PIXI.Sprite).from(url, {});
        sprite.width = border.width;
        sprite.height = border.height;
        sprite.alpha = settings.get('backgroundImageOpacity') as number;
        sprite.anchor.set(0.5);

        const oldSprite = this.backgroundSprite;

        if (!!oldSprite) {
            const changed = sprite.texture !== oldSprite.texture;
            this.destroyBackgroundImage(changed);
        }

        this.backgroundSprite = sprite;
        this.background.addChildAt(sprite, 0);

        if (!!border.circle) { /* rounded background image */ 
            let {width, height} = border;

            let elipse = new PIXI.Graphics()
                .beginFill(0xffffff)
                .drawEllipse(width/2, height/2, width/2, height/2)
                .endFill();
            elipse.pivot.set(width/2, height/2);

            this.background.addChildAt(elipse, 1);
            this.backgroundSprite.mask = elipse;
        }
    }
    
    /** @param {boolean} [state=false] */
    destroyBackgroundImage(state: boolean = false) {
        if (!this.backgroundSprite) return;
        this.backgroundSprite.destroy({ children: state, texture: state, baseTexture: state });
        this.backgroundSprite = null;
    }

    /** @param {boolean} state */
    toggleBackgroundImage(state: boolean) {
        if (state && !this.backgroundSprite) {
            this.setBackgroundImage();
        } else if (!state) {
            this.destroyBackgroundImage(true);
        }
    }

    resetBorder() {
        this.borderGraphic.destroy();
        this.borderGraphic = createBorderGraphic(this.border);
        this.background.addChild(this.borderGraphic);
    }

    /** @param {boolean} state */
    resetMassTextStyle(state: boolean) {
        if (state) {
            this.uninstallMassTextFont();
        }

        const textStyle = this.game.massTextStyle;
        PIXI.BitmapFont.from('mass', textStyle, {chars:'1234567890k.'});

        let options = { children: false, texture: false, baseTexture: false };

        const pool = this.game.massTextPool;
        while (pool.length) {
            pool.pop().destroy(options);
        }
        
        activeCells.forEach((cell) => {
            let pc = cell as PlayerCell;
            if (!pc.isPlayerCell || !pc.massText) return;
            pc.sprite.removeChild(pc.massText);
            pc.massText.destroy(options);
            delete pc.massText;
        });
    }

    uninstallMassTextFont() {
        PIXI.BitmapFont.uninstall('mass');
    }    
}