const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  )

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd',
          style: true
        })
      ]
    })
  }

  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#3cafcc' }
  })(config, env)

  config = rewireReactHotLoader(config, env)

  return config
}
