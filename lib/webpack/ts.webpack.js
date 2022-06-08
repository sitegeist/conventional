const path = require('path')
const glob = require('glob')
const TerserPlugin = require('terser-webpack-plugin');

const build = (workingDir, conventionalConfig, mode) => {
  let inputFiles = Object.keys(conventionalConfig.ts.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: glob.sync(conventionalConfig.ts.inputFiles[key])
    }),
    {}
  )
  if (conventionalConfig.browserUpdateNote) {
    inputFiles = {...inputFiles, browserUpdate: ['@sitegeist/conventional/lib/misc/browserupdate.js']}
  }

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: path.resolve(workingDir, conventionalConfig.ts.outputPath),
      filename: conventionalConfig.ts.outputFilePattern
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ]
    },
    resolve: {
      // options for resolving module requests
      // (does not apply to resolving to loaders)
      modules: [
        'node_modules'
      ],
      // directories where to look for modules
      extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
      minimize: conventionalConfig.minify,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

module.exports = {
  build
}
