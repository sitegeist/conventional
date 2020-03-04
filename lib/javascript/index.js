const webpack = require('webpack');

function init() {

}

function build(workingDir, config) {
    // TODO use config in project root by default
    const webpackConfigBuilder = require('./assets/webpack.config.js');
    const webpackConfig = webpackConfigBuilder(workingDir, config);
    //console.log(webpackConfig);

    const compiler = webpack(webpackConfig);

    console.log("\n");
    compiler.run((err, stats) => {
        if (err) {
            console.error('ERROR: Webpack failed to build.', err);
            return;
        }
        
        console.log(stats.toString({
            colors: true,
            entrypoints: false,
            chunks: false,
            //maxModules: 100
        }));
    });
}

function watch(workingDir, config) {
    // TODO use config in project root by default
    const webpackConfigBuilder = require('./assets/webpack.config.js');
    const webpackConfig = webpackConfigBuilder(workingDir, config);
    //console.log(webpackConfig);

    const compiler = webpack(webpackConfig);

    let statsConfig = {
        colors: true,
        entrypoints: false,
        chunks: false,
        builtAt: false,
        version: true,
        modules: true
    };

    compiler.watch({}, (err, stats) => {
        if (err) {
            console.log("\n");
            console.error('ERROR: Webpack failed to watch.', err);
            return;
        }

        console.log("\n");
        console.log(stats.toString(statsConfig));

        statsConfig.version = false;
        statsConfig.modules = false;
        
    });
}

function lint() {

}

module.exports = {
    init,
    build,
    watch,
    lint
};