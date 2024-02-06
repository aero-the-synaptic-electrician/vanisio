import {Game} from '@/game';
import {PlayerManager} from './game/player-manager';
import {ActionManager} from '@/game/action-manager';
import {Connection} from '@/network/connection';
import {Input} from '@/game/input';
import {Module} from './wasm';

interface Instances {
    gameObject: Game;
    playerManager: PlayerManager;
    actionManager: ActionManager;
    connection: Connection;
    input: Input;
    wasmModule: Module;
};

const instances = {} as Instances;

const detach = (callback: Function) => setTimeout(callback);

detach(() => {
    instances.gameObject = new Game(); // TODO: rename to 'game'?
});

detach(() => {
    instances.playerManager = new PlayerManager();
});

detach(() => {
    instances.actionManager = new ActionManager();
});

detach(() => {
    instances.connection = new Connection();
});

detach(() => {
    instances.input = new Input();
});

detach(() => {
    const m = new Module();
    m.init();

    instances.wasmModule = m;
})

function Singleton<T extends new (...args: any[]) => any>(Base: T, ...args: ConstructorParameters<T>) {
    class Instance extends Base {
        static #instance: InstanceType<T>;

        public static get(): InstanceType<T> {
            if (!this.#instance) {
                this.#instance = new Base(...args);
            }

            return this.#instance;
        }
    }
    
    return Instance as Omit<T, 'new'> & { get: () => InstanceType<T> };
}

const gameSingleton = Singleton(Game);

gameSingleton.get();

export default gameSingleton;