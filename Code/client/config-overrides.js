const { override } = require('customize-cra');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = override((config) => {
    config.plugins = (config.plugins || []).concat([
        new NodePolyfillPlugin({
            excludeAliases: ['console'],
        }),
    ]);
    return config;
});