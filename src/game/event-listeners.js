import gameObject from '.';
import renderer from '../renderer';
const canvas = renderer.view;
import Vector2 from '../physics/vector2';
import inputManager from './input';
import actionManager from './action-manager';

/** @type {Set<boolean>} */
const pressed = new Set();

let listening = false;

window.addEventListener('blur', () => pressed.clear());

const beforeUnloadListener = (e) => {
    e.preventDefault();
    return (e.returnValue = 'Are you sure you want to close the page?');
}

gameObject.on('game-stopped', () => {
    window.removeEventListener('beforeunload', beforeUnloadListener, {capture:true});
    listening = false;
});

gameObject.on('game-started', () => {
    window.addEventListener('beforeunload', beforeUnloadListener, {capture:true});
    listening = true;
});

window.addEventListener('resize', () => {
    if (!listening) return;
    gameObject.scene.setPosition();
});

canvas.addEventListener('mousedown', (e) => {
    if (!listening) return;

    e.preventDefault();
    canvas.focus();

    if (gameObject.spectating && e.button === 0) {
        const player = actionManager.findPlayerUnderMouse();

        if (player) {
            actionManager.spectate(player.pid);
        }

        return;
    }

    const key = 'MOUSE' + e.button;
    inputManager.press(key);
});

canvas.addEventListener('mouseup', (e) => {
    if (!listening) return;
    const key = `MOUSE${e.button}`;
    pressed.delete(key);
    inputManager.release(key);
});

canvas.addEventListener('mousemove', (e) => {
    if (!listening) return;

    const newPosition = new Vector2(e.clientX, e.clientY);

    if (settings.mouseFreezeSoft) {
        const {x:oldX, y:oldY} = gameObject.rawMouse;

        if (newPosition.x !== oldX || newPosition.y !== oldY) {
            actionManager.freezeMouse(false);
        }
    }

    gameObject.rawMouse.set(newPosition);
    gameObject.updateMouse();
});

canvas.addEventListener('wheel', (e) => {
    if (!listening) return;
    actionManager.zoom(e);
}, {passive:true});

document.body.addEventListener('keydown', (e) => {
    if (!listening) return;

    const focused = e.target === canvas;

    if (!focused && e.target !== document.body) return;

    const key = inputManager.convertKey(e.code);

    if (e.ctrlKey && key === 'TAB') return;

    if (pressed.has(key)) return;
    pressed.add(key);

    if (key === 'ESCAPE') {
        if (gameObject.replaying) {
            pressed.clear();
            gameObject.stop();
            gameObject.showMenu(true);
        } else {
            if (gameObject.deathTimeout) {
                gameObject.triggerAutoRespawn();
            } else {
                gameObject.showMenu();
            }
        }
    } else if (key === 'ENTER') {
        gameObject.emit('chat-focus');
    } else if (focused && inputManager.press(key)) {
        e.preventDefault();
    }
});

document.body.addEventListener('keyup', (e) => {
    if (!listening) return;
    const key = inputManager.convertKey(e.code);
    pressed.delete(key);
    inputManager.release(key);
});