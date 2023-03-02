// ==UserScript==
// @name         Loader for customized Vanis.io client
// @version      1.0.0
// @author       Aero
// @match        *://vanis.io/vanilla
// @run-at       document-start
// ==/UserScript==

(async (baseUrl) => {
    "use strict";

    function appendScript(source) {
        let node = document.createElement("script");
        node.type = "text/javascript";
        node.textContent = source;

        document.head.appendChild(node);
    }

    async function getAndLoadDependencies() {
        const names = ["vendor.js", "main.js"];

        for (let name of names) {
            let data = fetch(`${baseUrl}/js/${name}`)
                .then(response => response.text());

            // wait for script to load then continue
            await data.then(appendScript)
                .catch(() => {
                    throw new Error(`Failed to load dependency ${name}`);
                });
        }
    }

    // load page first  
    document.open();
    await fetch(`${baseUrl}/index.html`)
        .then(response => response.text())
        .then(data => document.write(data));
    document.close();

    // then script deps  
    getAndLoadDependencies();
})(
    "https://raw.githubusercontent.com/aero-the-synaptic-electrician/vanisio/main/src"
);
