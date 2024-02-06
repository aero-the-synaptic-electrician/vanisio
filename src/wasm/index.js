import {addOrUpdateCell, destroyCell, eatCell} from './bridge';

export class Module {
    /** @returns {boolean} **/
    async init() {
        if (!!this.initializing || !!this.instance) return false;
        this.initializing = true;
        let url = new URL('./module.wasm', import.meta.url);
        if (production) url.host = 'localhost:6969'
        const response = await fetch(url);
        const importObject = {
            env: {
                addOrUpdate: addOrUpdateCell,
                destroy: destroyCell,
                eat: eatCell,
                emscripten_notify_memory_growth: (index) => {}
            }
        };
        const instance = this.instance = await WebAssembly.instantiate(await WebAssembly.compile(await response.arrayBuffer()), importObject);
        const {memory} = instance.exports;
        this.HEAPU8 = new Uint8Array(memory.buffer);
        this.HEAPU16 = new Uint8Array(memory.buffer);
        this.HEAPF32 = new Uint8Array(memory.buffer);
        this.HEAPU32 = new Uint8Array(memory.buffer);
        delete this.initializing;
        return true;
    }

    /** 
     * @param {Uint8Array} data
     * @param {number} orderId 
     * @returns {number}
     */
    deserialize(data, orderId) {
        if (!this.instance) return 0;
        const {deserialize, malloc, free} = this.instance.exports;
        const dataSize = data.byteLength;
        const arrayPtr = malloc(dataSize);
        this.HEAPU8.set(data, arrayPtr);
        /** @type {number} */
        const count = deserialize(arrayPtr, orderId);
        free(arrayPtr);
        return count;
    }
};

const wasmModule = new Module();
wasmModule.init();

/** 
 * @param {SmartBuffer} packet 
 * @returns {number}
 */
const parseCells = (packet) => wasmModule.deserialize(new Uint8Array(packet.buffer, 1), 0); // TODO: implement 'orderId'

export {wasmModule, parseCells};