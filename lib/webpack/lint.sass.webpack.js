const path = require('path')
const fs = require('fs')
const os = require('os')
const glob = require('glob')
const StylelintPlugin = require('stylelint-webpack-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const jsonImporter = require('@indigotree/dart-sass-json-importer')
const magicImporter = require('node-sass-magic-importer')

const lint = (workingDir, conventionalConfig, mode) => {
  const inputFiles = Object.keys(conventionalConfig.sass.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: glob.sync(conventionalConfig.sass.inputFiles[key])
    }),
    {}
  )

  let stylelintConfigPath = ''

  if (fs.existsSync(path.join(workingDir, '.stylelintrc.json'))) {
    stylelintConfigPath = path.join(workingDir, '.stylelintrc.json')
    console.log('Using custom stylelint-configuration…')
  } else {
    stylelintConfigPath = path.join(__dirname, '..', '..', '.stylelintrc.json')
    console.log('Using standard stylelint-configuration…')
  }

  return {
    mode: mode,
    devtool: (conventionalConfig.sourceMaps) && mode !== 'production' ? 'source-map' : false,
    entry: inputFiles,
    context: workingDir,
    output: {
      path: fs.mkdtempSync(path.join(os.tmpdir(), 'lint-')),
      filename: '[name].temp.min.js'
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'resolve-url-loader'
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
      new StylelintPlugin({
        extensions: ['scss', 'sass'],
        configFile: stylelintConfigPath,
        failOnError: true,
        exclude: ['.Build']
      })
    ],
    watchOptions: {
      ignored: /node_modules/
    }
  }
}

module.exports = {
  lint
}
