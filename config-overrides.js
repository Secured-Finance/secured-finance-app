const path = require('path')
const rewireStyledComponents = require('react-app-rewire-styled-components')

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/

  config.resolve.extensions.push('.wasm')

  config.module.rules.forEach(rule => {
    ;(rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp)
      }
    })
  })

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }],
  })

  // For more config options check:
  // https://github.com/withspectrum/react-app-rewire-styled-components
  config = rewireStyledComponents(config, env)

  return config
}
