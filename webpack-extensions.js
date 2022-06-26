//webpack-extension.js

// extends rules for:
// next.config.js
// .storybook/webpack.config.js

module.exports = [
    {
        test: /\.svg$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                },
            },
        ],
    },
];
