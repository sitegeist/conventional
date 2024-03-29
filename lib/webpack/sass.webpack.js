const path = require('path')
const glob = require('glob-all')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const jsonImporter = require('@indigotree/dart-sass-json-importer')
const magicImporter = require('node-sass-magic-importer')

const build = (workingDir, conventionalConfig, mode) => {
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
    output: {
      path: path.resolve(workingDir, conventionalConfig.sass.outputPath),
      filename: conventionalConfig.sass.outputFilePattern + '.js'
    },
    module: {
      rules: [
        {
          test: /\.[s]?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                // url: false
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
              loader: 'resolve-url-loader',
              options: {
                sourceMap: conventionalConfig.sourceMaps
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  importer: [jsonImporter(), magicImporter()]
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
        filename: conventionalConfig.sass.outputFilePattern
      }),
      ...(conventionalConfig.sass.purgeFiles ? [new PurgecssPlugin({paths: glob.sync(conventionalConfig.sass.purgeFiles,  { nodir: true }), safelist: conventionalConfig.sass.purgeSafelist})] : [])
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
