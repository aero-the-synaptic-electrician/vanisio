import settings from '@/game/settings';

import * as PIXI from 'pixi.js';

PIXI.utils.skipHello();

let renderer = PIXI.autoDetectRenderer({
    resolution: settings.get('gameResolution'), // settings.customResolution') || window.devicePixelRatio || 1,
    view: document.getElementById('canvas') as HTMLCanvasElement,
    forceCanvas: !settings.get('useWebGL'),
    antialias: false,
    powerPreference: 'high-performance',
    backgroundColor: parseInt(settings.get('backgroundColor') as string, 16)
});

const redundantPlugins = ['interaction', 'accessibility'];

redundantPlugins.forEach(name => {
    let plugin = renderer.plugins[name];
    if (!!plugin) {
        plugin.destroy();
        delete renderer.plugins[name];
    }
})

const OnResize = () => {
    renderer.resize(window.innerWidth, window.innerHeight);
}

OnResize();
window.addEventListener('resize', OnResize);

renderer.clear();

export default renderer;