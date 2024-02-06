
const gameObject = require('./game');
const settings = require('./game/settings');
require('./game/event-listeners');
const playerManager = require('./game/player-manager');
const connection = require('./network/connection');
const {wasmModule} = require('./wasm');
const actionManager = require('./game/action-manager');

const {logEvent, toast} = require('./game/utils');

const PIXI = require('pixi.js');

const {createApp} = require('vue');
const App = require('./App.vue').default;

if (true || !production) {
    logEvent(0, 'Game', gameObject);
}

gameObject.playerManager = playerManager;

gameObject.connection = connection;

gameObject.actions = actionManager;

if (true || production) {
    global.module = wasmModule;
}

if ('VERSION' in PIXI) {
    logEvent(0, `Running PIXI v${PIXI.VERSION}`);
    global.PIXI = PIXI;
}

// Prevent right click attempts
document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

toast.fire({title: 'Hello, world!', icon:'success', timer:2000});

const app = gameObject.app = createApp(App);
app.mount('#app');

import {inputManager} from './singleton';

inputManager