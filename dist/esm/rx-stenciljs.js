import { p as promiseResolve, b as bootstrapLazy } from './index-b563d87d.js';
export { s as setNonce } from './index-b563d87d.js';

/*
 Stencil Client Patch Browser v4.3.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["rx-async",[[0,"rx-async",{"value":[16]}]]]], options);
});

//# sourceMappingURL=rx-stenciljs.js.map