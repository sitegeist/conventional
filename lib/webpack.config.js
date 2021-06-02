const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const jsonImporter = require('node-sass-json-importer')
const magicImporter = require('node-sass-magic-importer')

const jsConfig = (workingDir, conventionalConfig, mode) => {
  // const inputFiles = Object.keys(conventionalConfig.js.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: glob.sync(conventionalConfig.js.inputFiles[key])
  //   }),
  //   {}
  // )
  const inputFiles = conventionalConfig.js.inputFiles

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.js.outputPath),
      filename: conventionalConfig.js.outputFilePattern
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      // options for resolving module requests
      // (does not apply to resolving to loaders)
      modules: [
        'node_modules'
      ],
      // directories where to look for modules
      extensions: ['.js', '.json', '.jsx'],
      // specific aliases
      alias: {
        // "prefixes": (conventionalConfig.prefixOutputFile) ? path.resolve(workingDir, conventionalConfig.prefixOutputFile) : null
      }
    },
    optimization: {
      minimize: conventionalConfig.minify && mode === 'production'
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

const sassConfig = (workingDir, conventionalConfig, mode) => {
  // const inputFiles = Object.keys(conventionalConfig.sass.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: glob.sync(conventionalConfig.sass.inputFiles[key])
  //   }),
  //   {}
  // )
  const inputFiles = conventionalConfig.sass.inputFiles

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.sass.outputPath),
      filename: conventionalConfig.sass.outputFilePattern + '.js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
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
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: conventionalConfig.sass.outputFilePattern
      })
    ]
  }
}

module.exports = {
  jsConfig,
  sassConfig
}

module.exports.parallelism = 2
