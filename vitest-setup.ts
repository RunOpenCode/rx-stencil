import { beforeAll } from 'vitest';

beforeAll(async (): Promise<void> => {
    // @ts-ignore
    await import('./dist/rx-stencil/rx-stencil.esm.js');
});

export {};