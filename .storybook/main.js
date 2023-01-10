const webpack = require('./../webpack-config');

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        'storybook-addon-performance',
        'storybook-addon-next',
        'storybook-addon-apollo-client',
        '@storybook/addon-interactions',
    ],
    typescript: {
        reactDocgen: 'none',
    },
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
    },

    webpackFinal: (config, options) => webpack.webpackOverride(config),
};
