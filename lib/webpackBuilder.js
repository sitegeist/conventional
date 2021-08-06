const availableTypes = [
  'js',
  'sass'
]

const typeCheck = type => {
  if (!availableTypes.includes(type)) {
    console.error(`Invalid configuration type: ${type}`)
    return {}
  }
}

const build = (type, mode, workingDir, config) => {
  typeCheck(type)

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
  typeCheck(type)
  const webpackBuilder = require(`./webpack/lint.${type}.webpack.js`)
  return webpackBuilder.lint(workingDir, config, mode)
}

const lintAll = (mode, workingDir, config) => {
  return availableTypes.map(type => {
    const webpackBuilder = require(`./webpack/lint.${type}.webpack.js`)
    return webpackBuilder.lint(workingDir, config, mode)
  })
}

module.exports = {
  build,
  buildAll,
  lint,
  lintAll
}
