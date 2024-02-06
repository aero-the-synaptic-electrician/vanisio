import Player from './player';
import {logEvent} from './utils';

// use instead of bot name passed from server
const kRobotEmoji = decodeURIComponent('%F0%9F%A4%96');

export class PlayerManager {
    constructor() {
        /** @type {Map<number, Player>} */
        this.players = new Map();

        /** @type {number[]} */
        this.playersRemoving = [];

        /** @type {number} */
        this.botCount = 0;
    }

    reset() {
        this.players.forEach((_, pid) => this.remove(pid));
        this.botCount = 0;
        this.playersRemoving.splice(0, this.playersRemoving.length);
    }

    /** 
     * @param {number} id
     * @returns {Player?}
     */
    getPlayer(id) { 
        const {players} = this;
        return players.has(id) ? players.get(id) : null;
    }

    /** 
     * @param {PlayerData}
     * @returns {Player}
     */
    set({pid, nickname:name, skin, skinUrl, nameColor, tagId, bot}) {
        /** @type {Player} */
        let player;

        if (!!nameColor) console.log(nameColor);

        if (this.players.has(pid)) {
            player = this.players.get(pid);
        } else {
            this.players.set(pid, player = new Player(pid, !!bot));            
            if (!!bot) {
                this.botCount++;
                name = kRobotEmoji;
            }
        }

        if (!!skin) {
            skinUrl = `https://skins.vanis.io/s/${skin}`;
        }
        
        const nameChanged = player.setName(name, nameColor);
        const skinChanged = player.setSkin(skinUrl);
        const tagChanged = player.setTagId(tagId);

        logEvent(0, '[UPDATE]', pid, '=', player);

        if (nameChanged || skinChanged || tagChanged) {
            player.invalidateVisibility();
        }

        return player;
    }

    /** @param {Set<Player>} [players] */
    invalidateVisibility(players) {
        for (const player of this.players.values()) {
            if (!players || !players.has(player)) {
                player.invalidateVisibility();
            }
        }
    }
    
    /** 
     * @param {number} pid
     * @param {boolean} [addToSweep]
     * @returns {void}
     */
    remove(pid, addToSweep=false) {
        if (!this.players.has(pid)) return;
        if (!!addToSweep) return void this.playersRemoving.push(pid);
        const player = this.players.get(pid);
        logEvent(0, '[REMOVE]', pid, '=', player);
        if (player.bot) this.botCount--;
        player.destroy();
        this.players.delete(pid);
    }

    sweepRemovedPlayers() {
        const {playersRemoving} = this;
        while (playersRemoving.length) {
            const pid = playersRemoving.shift();
            this.remove(pid);
        }
    }    
};

// Singleton instance.
const playerManager = new PlayerManager();
export default playerManager;