# @sitegeist/conventional

Frontend toolchain for sitegeist TYPO3 projects

## Features

* Bundles sitegeist's frontend toolchain for TYPO3 projects (with and without fluid components)
* Enables centralized design tokens in a json/json5 file which can be used in sass files,
 javascript as well as TYPO3 and fluid components
* Easy imports of multiple sass/js files via glob
* Autoprefixing (similar to CSS modules) for selected sass files
* Builds SVG sprites from folders of individual svg files
* Minifies frontend assets and generates source map files

## Usage

```
npx @sitegeist/conventional init
```

* Creates default `.conventional.config.json`
* Creates default `.browserslistrc`
* Creates `package.json` (if it already exists, it provides instructions to change it => https://www.npmjs.com/package/diff)
   * requires conventional
   * registers commands (build, watch...)
* Creates `webpack.config.js` (if it already exists, it provides instructions to change it => https://www.npmjs.com/package/diff)
   * reads input/output and settings from conventional configuration file
   * provides method to obtain current prefix

### package.json

https://github.com/npm/init-package-json

```json
{
   "scripts": {
       "build": "conventional build",
       "watch": "conventional watch",
       "lint": "conventional lint"
   },
   "devDependencies": {
       "@sitegeist/conventional"
   }
}
```

### webpack.config.js

```js
import conventionalConfig from ('.conventional.config.json');

module.exports = {
   entry: {
       // Read input/output pairs from conventional configuration
       ...conventionalConfig.js.map(config => { import: config.inputFile, filename: config.outputFile })
   },
   // ...
};
```

## Configuration

.conventional.config.json

```json
{
   "minify": true,
   "sourceMaps": true,
   "prefixOutputFile": "./Resources/Public/Css/All.prefix.json",
   "css": [
       {
           "inputFile": "./Resources/Private/Styles/Main.scss",
           "outputFile": "./Resources/Public/Css/Main.min.css"
       },
       {
           "inputFile": "./Resources/Private/Styles/Additional.scss",
           "outputFile": "./Resources/Public/Css/Additional.min.css"
       }
   ],
   "js": [
       {
           "inputFile": "./Resources/Private/JavaScript/Main.js",
           "outputFile": "./Resources/Public/JavaScript/Main.min.js"
       },
       {
           "inputFile": "./Resources/Private/JavaScript/Additional.js",
           "outputFile": "./Resources/Public/JavaScript/Additional.min.js"
       }
   ],
   "svg": [
       {
           "inputFiles": "./Resources/Private/Svg/*.svg",
           "outputFile": "./Resources/Public/Images/Sprite.svg"
       }
   ]
}
```

## Available Commands

```
conventional init

conventional build
conventional build:css
conventional build:js
conventional build:svg

conventional watch
conventional watch:css
conventional watch:js
conventional watch:svg

conventional lint
conventional lint:css
conventional lint:js
conventional lint:svg
```

Maybe later:

```
conventional test
conventional test:css
conventional test:js
```