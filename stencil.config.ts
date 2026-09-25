import { Config } from '@stencil/core';
import { sass }   from '@stencil/sass';

export const config: Config = {
    namespace:         'rx-stencil',
    plugins:           [
        sass(),
    ],
    outputTargets:     [
        {
            type:          'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements',
        },
        {
            type: 'docs-readme',
        },
        {
            type:          'www',
            serviceWorker: null, // disable service workers
        },
    ],
    excludeComponents: [
        'test-from-event',
        'test-observe-multiple-props',
        'test-observe-props',
        'test-while-connected',
    ],
    buildDist:         true,
};
