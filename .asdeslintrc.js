module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
        ['@babel/preset-react']
      ]
    }
  }
};
