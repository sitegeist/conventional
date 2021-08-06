const path = require('path')
const glob = require('glob')
const StylelintPlugin = require('stylelint-webpack-plugin')
const jsonImporter = require('node-sass-json-importer')
const magicImporter = require('node-sass-magic-importer')

const lint = (workingDir, conventionalConfig, mode) => {
  const inputFiles = Object.keys(conventionalConfig.sass.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: glob.sync(conventionalConfig.sass.inputFiles[key])
    }),
    {}
  )

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: (conventionalConfig.autoprefixer) ? [['autoprefixer']] : []
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  importer: [jsonImporter(), magicImporter()]
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [new StylelintPlugin({
      extensions: ['scss', 'sass']
    })],
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

module.exports = {
  lint
}
