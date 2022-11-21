const path = require('path')
const glob = require('glob-all')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')

const build = (workingDir, conventionalConfig, mode) => {
  const inputFiles = Object.keys(conventionalConfig.less.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: glob.sync(conventionalConfig.less.inputFiles[key])
    }),
    {}
  )

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.less.outputPath),
      filename: conventionalConfig.less.outputFilePattern + '.js'
    },
    module: {
      rules: [
        {
          test: /\.less$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: (conventionalConfig.autoprefixer) ? [['autoprefixer']] : []
                }
              }
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true
                }
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: conventionalConfig.less.outputFilePattern
      }),
      ...(conventionalConfig.less.purgeFiles ? [new PurgecssPlugin({paths: glob.sync(conventionalConfig.less.purgeFiles,  { nodir: true }), safelist: conventionalConfig.less.purgeSafelist})] : [])
    ],
    optimization: {
      minimize: conventionalConfig.minify,
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
  }
}

module.exports = {
  build
}
