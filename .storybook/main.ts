const webpack = require('./../webpack-config');
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        'storybook-addon-performance',
        'storybook-addon-apollo-client',
        '@storybook/addon-interactions',
        'storybook-mock-date-decorator',
    ],
    typescript: {},
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    webpackFinal: (config, options) => webpack.webpackOverride(config),
    env: config => ({
        ...config,
        COMMIT_HASH: '.storybook',
    }),
};

export default config;
