if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return a[e]||(r=new Promise(async r=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=r}else importScripts(e),r()})),r.then(()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]})},r=(r,a)=>{Promise.all(r.map(e)).then(e=>a(1===e.length?e[0]:e))},a={require:Promise.resolve(r)};self.define=(r,i,c)=>{a[r]||(a[r]=Promise.resolve().then(()=>{let a={};const s={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return a;case"module":return s;default:return e(r)}})).then(e=>{const r=c(...e);return a.default||(a.default=r),a})}))}}define("./service-worker.js",["./workbox-24aa846e"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./index.html",revision:"3d3fc1f96f301dd00a69030a565cadb5"},{url:"3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"main.css?0f843aef0cac1257f5a3",revision:"b9c780b023a4a4dabd39af0727cb2103"},{url:"main.js?88274efa695ce4ec032a",revision:"eaacd498b72daab0002f6ab90d486012"},{url:"vendors~main.js?d1e9460fdff256ebbdac",revision:"e0bc252f827bf0625dea96929cc31460"}],{})}));
