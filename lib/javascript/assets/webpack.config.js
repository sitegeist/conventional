const path = require('path');

module.exports = function (workingDir, conventionalConfig) {
    return {
        mode: 'production',
        devtool: (conventionalConfig.sourceMaps) ? 'source-map' : false,
        entry: conventionalConfig.js.inputFiles,
        context: workingDir,
        output: {
            path: path.resolve(workingDir, conventionalConfig.js.outputPath),
            filename: conventionalConfig.js.outputFilePattern
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { useBuiltIns: "usage", corejs: 3 }]
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            // options for resolving module requests
            // (does not apply to resolving to loaders)
            modules: [
                "node_modules"
            ],
            // directories where to look for modules
            extensions: [".js", ".json", ".jsx"],
            // specific aliases
            alias: {
                //"prefixes": (conventionalConfig.prefixOutputFile) ? path.resolve(workingDir, conventionalConfig.prefixOutputFile) : null
            }
        },
        optimization: {
            minimize: conventionalConfig.js.minify
        },
        watchOptions: {
            ignored: /node_modules/
        }
    }
};
