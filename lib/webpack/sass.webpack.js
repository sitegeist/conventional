const path = require('path')
// const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const jsonImporter = require('node-sass-json-importer')
const magicImporter = require('node-sass-magic-importer')

const build = (workingDir, conventionalConfig, mode) => {
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
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      (conventionalConfig.autoprefixer) ? 'autoprefixer' : false,
                      {
                        // Options
                      },
                    ],
                  ],
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
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: conventionalConfig.sass.outputFilePattern
      })
    ]
  }
}

module.exports = {
  build
}
