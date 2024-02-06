import gameObject from '@/game';
import playerManager from '@/game/player-manager';
import settings from '@/game/settings';
import {clampNumber} from '@/game/utils';

import Cell, {activeCells} from '@/cells/cell';
import {PlayerCell, Virus, EjectedMass, Food, DeadCell, Crown, Coin} from '@/cells';

type Variant = typeof Virus | 
 typeof EjectedMass | 
 typeof Food | 
 typeof DeadCell | 
 typeof Crown | 
 typeof Coin;

// List of basic cell classes (to optimize cell creation) 
let classMap = new Map<number, Variant>([
	[2, Virus],
	[3, EjectedMass],
	[4, Food],
	[5, DeadCell],
	[6, Crown],
	[9, Coin]
]);

const addOrUpdateCell = (indicies: number, pid: number, id: number, x: number, y: number, size: number, flags: number, orderId: number): number => {
	// TODO: implement 'orderId'
	
	let type = indicies & 0x0f;

	x = (indicies & 0x20) ? undefined : x;
	size = (indicies & 0x40) ? undefined : size;

	if ((type === 3 || type === 4) && (x === undefined || size === undefined)) {
		let {food} = gameObject;
		let s = size = ((type === 3) ? food.ejectedSize || 1 : food.minSize + id % food.stepSize || 1);

		if (type == 4) {
			let {border} = gameObject;
			x = border.minx + s + (border.width - 2 * s) * gameObject.seededRandom(65536 + id);
			y = border.miny + s + (border.height - 2 * s) * gameObject.seededRandom(131072 + id);
		}
	}

	let cell: Cell;

	if (activeCells.has(id)) {
        cell = activeCells.get(id);
        cell.update(gameObject.timeStamp);
        cell.ox = cell.x;
        cell.oy = cell.y;
        cell.oSize = cell.size;

        if (x !== undefined) {
            cell.nx = x;
            cell.ny = y;
        }
    
        if (size !== undefined) {
            cell.nSize = size;
        }    
	} else {
        if (classMap.has(type)) { // mixed class (basic cell classes)
            const variantClass = classMap.get(type);
            cell = new variantClass(id, x, y, size, flags);
        } else if (type == 1) { // player
            const player = playerManager.getPlayer(pid);
            cell = new PlayerCell(id, x, y, size, flags, player);
		} else { // customized cell
			let color = 0x404040;
			let circle = true;

			if (flags>1) {
				color = 0;

				if (flags & 0x80) {
					color |= 0x700000;
				}

				if (flags & 0x40) {
					color |= 0x7000;
				}

				if (flags & 0x20) {
					color |= 0x70;
				}

				if (flags & 0x10) {
					circle = false;
				}
			}

			cell = new DeadCell(id, x, y, size, flags, circle, color);
		}

		const {scene} = gameObject;
		scene[(flags & 1) ? 'addFood' : 'addCell'](cell.sprite);

		activeCells.set(id, cell);
	}

	cell.updateStamp = gameObject.timeStamp;

	const playerCell = cell as PlayerCell;
	return (!!playerCell.pid && playerCell.pid === gameObject.activePid) ? 1 : 0;
}

const destroyCell = (id: number) => {
	if (activeCells.has(id)) {
        activeCells.get(id).destroy();
    }    
}

const eatCell = (pid: number, eid: number) => {
	if (!activeCells.has(pid)) return;
	const prey = activeCells.get(pid);
	if (!activeCells.has(eid)) return prey.destroy();
	const eater = activeCells.get(eid);
	prey.update(prey.updateStamp = gameObject.timeStamp);
	prey.destroy(settings.get('eatAnimation'));
	prey.nx = eater.nx; // TODO: possibly eater.x/y
	prey.ny = eater.ny;
	const s = prey.nSize;
	prey.nSize = 0;
	prey.scale = clampNumber((s/eater.nSize), 0, 1);
}

export {addOrUpdateCell, destroyCell, eatCell};