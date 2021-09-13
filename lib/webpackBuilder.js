const build = (type, availableTypes, mode, workingDir, config) => {
  if (!availableTypes.building.includes(type)) {
    console.error(`Invalid configuration type: ${type}. Check your settings in conventional.config.json for ${type}.`)
    return {}
  }

  const webpackBuilder = require(`./webpack/${type}.webpack.js`)
  return webpackBuilder.build(workingDir, config, mode)
}

const buildAll = (mode, availableTypes, workingDir, config) => {
  return availableTypes.building.map(type => {
    const webpackBuilder = require(`./webpack/${type}.webpack.js`)
    return webpackBuilder.build(workingDir, config, mode)
  })
}

const lint = (type, availableTypes, mode, workingDir, config) => {
  if (!availableTypes.linting.includes(type)) {
    console.error(`Invalid configuration type: ${type}. Check your settings in conventional.config.json for ${type}.`)
    return {}
  }

  const webpackBuilder = require(`./webpack/lint.${type}.webpack.js`)
  return webpackBuilder.lint(workingDir, config, mode)
}

const lintAll = (mode, availableTypes, workingDir, config) => {
  return availableTypes.linting.map(type => {
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
