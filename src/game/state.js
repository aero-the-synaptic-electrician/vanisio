/** @type {State} */
let gameState = {
    connectionUrl: null,
    selectedServer: null,
    spectators: 0,
    allowed: false,
    playButtonDisabled: false,
    playButtonText: 'Play',
    deathDelay: false,
    autoRespawning: false,
    alive: false
};

export default gameState;