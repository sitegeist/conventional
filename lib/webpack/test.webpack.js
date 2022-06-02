const WebpackLighthousePlugin = require('webpack-lighthouse-plugin');

const test = (workingDir, conventionalConfig, mode) => {
  if (conventionalConfig.lighthouseTest) {
    module.exports = {
      plugins: [
        new WebpackLighthousePlugin({
          url: 'https://airhorner.com'
        })
      ],
    };
  }
}

module.exports = {
  test
}
