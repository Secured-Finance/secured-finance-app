const extensionRules = require('../webpack-extensions');
const webpack = require('webpack');

module.exports = {
    module: {
        rules: extensionRules,
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
