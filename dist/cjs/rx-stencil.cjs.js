'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-5f6f12ab.js');

/*
 Stencil Client Patch Browser v4.3.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('rx-stencil.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["rx-async.cjs",[[0,"rx-async",{"value":[16]}]]]], options);
});

exports.setNonce = index.setNonce;

//# sourceMappingURL=rx-stencil.cjs.js.map