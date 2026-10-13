import { defineVitestConfig }  from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';
import { playwright }          from '@vitest/browser-playwright';

export default defineVitestConfig({
    stencilConfig: './stencil.config.ts',
    test:          {
        coverage: {
            provider: 'v8',
            exclude:  [
                'src/components/tests',
            ],
        },
        projects: [
            {
                test: {
                    name:        'unit',
                    include:     ['src/tests/**/*.unit.{ts,tsx}'],
                    environment: 'node',
                },
            },
            {
                plugins: [stencilVitestPlugin()],
                test:    {
                    name:               'spec',
                    include:            ['src/tests/**/*.spec.{ts,tsx}'],
                    environment:        'stencil',
                    environmentOptions: {
                        stencil: {
                            domEnvironment: 'jsdom',
                        },
                    },
                },
            },
            {
                test: {
                    name:            'browser',
                    include:         ['src/**/*.test.{ts,tsx}'],
                    setupFiles:      ['./vitest-setup.ts'],
                    browser:         {
                        enabled:            true,
                        provider:           playwright(),
                        headless:           true,
                        instances:          [{browser: 'chromium'}],
                        screenshotFailures: false,
                    },
                },
            },
        ],
    },
});
