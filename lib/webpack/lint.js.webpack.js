const path = require('path')
const glob = require('glob')
const fs = require('fs')
const os = require('os')

const lint = (workingDir, conventionalConfig, mode) => {
  let inputFiles = Object.keys(conventionalConfig.js.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: glob.sync(conventionalConfig.js.inputFiles[key])
    }),
    {}
  )

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'), (err, folder) => folder),
      filename: '[name].temp.min.js'
    },
    module: {
      rules: [
        {
          // set up standard-loader as a preloader
          enforce: 'pre',
          test: /\.jsx?$/,
          loader: 'standard-loader',
          exclude: /(node_modules|bower_components)/,
          options: {
            // config options to be passed through to standard e.g.
            parser: 'babel-eslint'
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
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

module.exports = {
  lint
}
