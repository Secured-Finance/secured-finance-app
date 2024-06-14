const webpack = require('./../webpack-config');
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [{ from: '../src/assets', to: 'static/media/src/assets' }],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        'storybook-addon-performance',
        'storybook-addon-apollo-client',
        '@storybook/addon-interactions',
        '@storybook/addon-designs',
        '@storybook/addon-queryparams',
        'storybook-addon-cookie',
    ],
    typescript: {
        reactDocgen: false,
    },
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    webpackFinal: (config, _options) => webpack.webpackOverride(config),
    env: config => ({
        ...config,
        COMMIT_HASH: '.storybook',
    }),
};

export default config;
