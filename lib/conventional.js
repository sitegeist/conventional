module.exports = (action, type, mode, workingDir, config) => {
  const actionFunc = require(`./actions/${action}`)
  actionFunc(type, mode, workingDir, config)
}
