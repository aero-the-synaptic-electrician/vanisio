import gameObject from '@/game';
import playerManager from '@/game/player-manager';
import Player from '@/game/player';

import SmartBuffer from './management/smart-buffer';

const parseInitialData = (packet: SmartBuffer) => {
    const data = {} as InitialData;
    
    const border = data.border = {} as Border;

    data.protocol = packet.readUInt8();

    if (data.protocol >= 4) {
        data.gamemodeId = packet.readUInt8();

        data.instanceSeed = packet.readUInt16LE();

        data.playerId = packet.readUInt16LE();

        border.minx = packet.readInt16LE();
        border.miny = packet.readInt16LE();
        border.maxx = packet.readInt16LE();
        border.maxy = packet.readInt16LE();

        let flags = packet.readUInt8();
        border.circle = !!(flags & 1);

        let food = data.food = {} as Food;

        if (flags & 2) {
            const min = food.minSize = packet.readUInt16LE();
            const max = food.maxSize = packet.readUInt16LE();
            food.stepSize = (max - min);
        }

        if (flags & 4) {
            food.ejectedSize = packet.readUInt16LE();
        }

        border.width = border.maxx - border.minx;
        border.height = border.maxy - border.miny;
    } else {
        if (data.protocol >= 2) {
            data.gamemodeId = packet.readUInt8();

            data.instanceSeed = packet.readUInt16LE();

            data.playerId = packet.readUInt16LE();

            border.width = packet.readUInt32LE();
            border.height = packet.readUInt32LE();
        } else {
            data.gamemodeId = 1;

            data.instanceSeed = packet.readInt16LE();

            data.playerId = packet.readInt16LE();

            let scale = packet.readUInt16LE();
            border.width = scale;
            border.height = scale;
        }

        border.minx = -border.width/2;
        border.miny = -border.height/2;
        border.maxx = +border.width/2;
        border.maxy = +border.height/2;
    }

    border.x = (border.minx + border.maxx)/2;
    border.y = (border.miny + border.maxy)/2;

    return data;
}

const parsePlayers = (packet: SmartBuffer) => {
    let playersData = JSON.parse(packet.readEscapedString()) as PlayerData[];
    let activePlayer = playersData.find(p => p.pid === gameObject.playerId);
    const tagChanged = !!activePlayer && gameObject.setTagId(activePlayer.tagId);

    let players = new Set<Player>();

    playersData.forEach((d) => {
        const player = playerManager.set(d);
        players.add(player);
    });

    if (tagChanged) {
        gameObject.emit('minimap-positions', []);
        playerManager.invalidateVisibility(players);
    }
}

export {parseInitialData, parsePlayers};