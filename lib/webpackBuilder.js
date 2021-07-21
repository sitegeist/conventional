const availableTypes = [
  'js',
  'sass'
]

const build = (type, mode, workingDir, config) => {
  if (!availableTypes.includes(type)) {
    console.error(`Invalid configuration type: ${type}`)
    return {}
  }

  const webpackBuilder = require(`./webpack/${type}.webpack.js`)
  return webpackBuilder.build(workingDir, config, mode)
}

const buildAll = (mode, workingDir, config) => {
  return availableTypes.map(type => {
    const webpackBuilder = require(`./webpack/${type}.webpack.js`)
    return webpackBuilder.build(workingDir, config, mode)
  })
}

const lint = (type, mode, workingDir, config) => {
  const webpackBuilder = require(`./webpack/lint.webpack.js`)
  return webpackBuilder.lint(workingDir, config, mode)
}

module.exports = {
  build,
  buildAll,
  lint
}
