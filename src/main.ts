import gameObject from "./game";
import settings from "./game/settings";
require('./game/event-listeners');
import playerManager from "./game/player-manager";
import connection from "./network/connection";
import {wasmModule} from './wasm';
import actionManager from "./game/action-manager";
import {logEvent, toast} from "./game/utils";

import * as PIXI from 'pixi.js';

import {createApp} from 'vue';

import App from '@/App.vue';

logEvent(0, 'Game', gameObject);

gameObject.playerManager = playerManager;

gameObject.connection = connection;

gameObject.actions = actionManager;

global.wasmModule = wasmModule;

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