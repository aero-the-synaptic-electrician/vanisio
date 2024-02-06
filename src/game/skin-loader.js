import {logEvent} from './utils';

/**
 * @param {Loader}
 * @param {Callback} callback
 */
const removeCallbacks = ({callbacks}, callback) => {
    const index = callbacks.indexOf(callback);
    if (index >= 0) {
        callbacks.splice(index, 1);
    }
}

export default class SkinLoader {
    constructor() {
        /** @type {Map<string, Loader>} */
        this.loaders = new Map();
        
        this.load();
    }

    async load() {
        let url = new URL('./skin-worker.js', import.meta.url);
        if (production) url.host = 'localhost:6969';
        logEvent(1, url);
        const response = await fetch(url);
        const blob = URL.createObjectURL(await response.blob());
        logEvent(0, `Skin worker loaded at "${blob}"`);
        this.worker = new Worker(blob);
        this.worker.addEventListener('message', this.onSkinLoaded.bind(this));
    }

    /**
     * @param {Callback} callback 
     * @returns {Loader}
     */
    createLoader(callback) {
        return {
            image: null,
            callbacks: [callback]
        };
    }
    
    clearCallbacks() {
        this.loaders.clear();
    }

    /**
     * @param {string} url
     * @param {function} callback
     * @returns {function}
     */
    loadSkin(url, callback) {
        if (!this.loaders.has(url)) {
            const loader = this.createLoader(callback);
            this.loaders.set(url, loader);
            this.worker.postMessage(url);
            return removeCallbacks.bind(null, loader, callback);		
        }

        let loader = this.loaders.get(url);

        if (!!loader.image) {
            callback(loader.image);
        } else if (!loader.errored) {
            loader.callbacks.push(callback);
            return removeCallbacks.bind(null, loader, callback);
        }
        
        return null;
    }
    
    /** @param {MessageEvent<ResponseData>} e */
    onSkinLoaded(e) {
        const {url, image, errored} = e.data;

        let loader = this.loaders.get(url);

        if (!errored) {
            loader.image = image;

            const {callbacks:list} = loader;
            while (list.length) {
                const callback = list.pop();
                callback(image);
            }
        } else {
            loader.errored = true;
            loader.callbacks = [];
        }
    }
};