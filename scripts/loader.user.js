// ==UserScript==
// @name         Beta client loader
// @version      1.0.1
// @icon         https://github.com/aero-the-synaptic-electrician/vanisio-client/raw/main/img/favicon.png
// @author       Aero
// @match        *://vanis.io/vanilla
// @grant        none
// @run-at       document-end
// ==/UserScript==

(()=>{"use strict";class t{#a;#b;constructor(t){this.baseUrl=t,this.#a=["vendor.js","main.js"],this.#b=["style.css"]}loadPage(){return new Promise(async t=>{document.open();let e=await fetch(`${this.baseUrl}index.html`,{method:"GET"}),r=await e.text();document.write(r),document.close(),t()})}load(t,e,r,a){let s=e.length;return new Promise((i,o)=>{e.forEach(async e=>{let l=null;try{let c=await fetch(`${t}${e}`);l=await c.text()}catch(n){return s--,void o(n?n.message||n:`Script '${e}' faiiled to load without an error message`)}if("string"!=typeof l)return s--,void o(`Source for script '${e}' wasn't a string`);let d=document.createElement(r);d.type=a,d.textContent=l,document.head.appendChild(d),0==--s&&i()})})}loadScripts(){return this.load(`${this.baseUrl}js/`,this.#a,"script","text/javascript")}loadStyles(){return this.load(`${this.baseUrl}css/`,this.#b,"style","text/css")}}let e=new t("https://raw.githubusercontent.com/aero-the-synaptic-electrician/vanisio/main/web/");e.loadPage().then(()=>{e.loadScripts().catch(()=>{console.error("Loader::loadScripts() errored",error)}),e.loadStyles().catch(()=>{console.error("Loader::loadStyles() errored",error)})}).catch(t=>{console.error("Loader::loadPage() errored",t)})})();
