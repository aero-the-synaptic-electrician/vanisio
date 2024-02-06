// ==UserScript==
// @name         Beta client
// @version      1.0.0
// @icon         https://github.com/aero-the-synaptic-electrician/vanisio-client/raw/main/img/favicon.png
// @author       Aero
// @match        *://vanis.io/vanilla
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
	'use strict';

    // document loader 
    class Loader {
        #scriptNames;
        #styleNames;
        
        /** @param {string} baseUrl */
        constructor(baseUrl) {
            /** 
             * @type {string}
             * @readonly
             */
            this.baseUrl = baseUrl;

            /** @type {string[]} */
            this.#scriptNames = ['vendor.js', 'main.js'];

            this.#styleNames = ['style.css'];
        }

        /** @returns {Promise<void>} */
        loadPage() {
            return new Promise(async (done) => {
                document.open();
                const response = await fetch(`${this.baseUrl}index.html`, {method:'GET'});
                const source = await response.text();
                document.write(source);
                document.close();
                done();
            });
        }

        /**
         * @param {string} directoryUrl 
         * @param {string[]} fileNames
         * @param {string} elementTag
         * @param {string} elementType
         * @returns {Promise<void>}
         */
        load(directoryUrl, fileNames, elementTag, elementType) {
            let fileCount = fileNames.length;
            return new Promise((resolve, reject) => {
                fileNames.forEach(async (name) => {
                    /** @type {string?} */
                    let source = null;

                    try {
                        const response = await fetch(`${directoryUrl}${name}`);
                        source = await response.text();
                    } catch (e) {
                        fileCount--;
                        return void reject(e ? (e.message || e) : `Script '${name}' faiiled to load without an error message`);
                    }

                    if (typeof source !== 'string') {
                        fileCount--;
                        return void reject(`Source for script '${name}' wasn't a string`);
                    }
                    
                    const node = document.createElement(elementTag);
                    node.type = elementType;
                    node.textContent = source;
                    document.head.appendChild(node);
                    
                    if (--fileCount == 0) resolve();
                });
            });
        }
        
        /** @returns {Promise<void>} */
        loadScripts() { return this.load(`${this.baseUrl}js/`, this.#scriptNames, 'script', 'text/javascript'); }

        loadStyles() { return this.load(`${this.baseUrl}css/`, this.#styleNames, 'style', 'text/css'); }
    }

    const loader = new Loader('https://raw.githubusercontent.com/aero-the-synaptic-electrician/vanisio/main/dist/');
    loader.loadPage().then(() => {
        loader.loadStyles().catch(() => {
            console.error('Loader::loadStyles() errored', error);
        });

        loader.loadScripts().catch(() => {
            console.error('Loader::loadScripts() errored', error);
        });
    }).catch(error => {
        console.error('Loader::loadPage() errored', error);
    })
})();