const path = require('path')
const glob = require('glob')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')

const build = (workingDir, conventionalConfig, mode) => {
  return {
    mode: mode,
    devtool: false,
    entry: glob.sync(conventionalConfig.spritemap.inputFiles),
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.spritemap.outputPath),
      filename: '[name].spritemap.js'
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader'
        }
      ]
    },
    plugins: [
      new SVGSpritemapPlugin(conventionalConfig.spritemap.inputFiles, {
        output: {
          filename: conventionalConfig.spritemap.outputFileName,
          svg: {
            sizes: false
          }
        },
        sprite: {
          prefix: conventionalConfig.spritemap.prefix ? conventionalConfig.spritemap.prefix : ''
        }
      }),
      new RemovePlugin({
        after: {
          root: workingDir,
          test: [
            {
              folder: path.resolve(workingDir, conventionalConfig.spritemap.outputPath),
              method: (absoluteItemPath) => {
                return new RegExp(/\.spritemap\.js$/, 'm').test(absoluteItemPath)
              }
            }
          ]
        }
      })
    ]
  }
}

module.exports = {
  build
}
