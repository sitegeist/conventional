# @sitegeist/conventional

Frontend toolchain for sitegeist TYPO3 projects

## Features

* Bundles sitegeist's frontend toolchain for TYPO3 projects (with and without fluid components)
* Enables centralized design tokens in a json/json5 file which can be used in sass files,
 javascript as well as TYPO3 and fluid components
* Easy imports of multiple sass/js files via glob
* Autoprefixing of new CSS properties for older browsers (respects browserslist of project)
* Automatic polyfills for new JavaScript features with babel (respects browserslist of project)
* Minifies frontend assets and generates source map files

### Planned features

* Autoprefixing of CSS classes (similar to CSS modules) for selected sass files
* Builds SVG sprites from folders of individual svg files

## Usage

```
npx @sitegeist/conventional init
```

* Creates default `.conventional.config.json`
* Creates default `.browserslistrc`
* Creates `package.json` (if it already exists, it provides instructions to change it => https://www.npmjs.com/package/diff)
   * requires conventional
   * registers commands (build, watch...)
* Optionally creates `webpack.config.js` (if it already exists, it provides instructions to change it => https://www.npmjs.com/package/diff)
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
       "@sitegeist/conventional": "^1.0"
   }
}
```

## Configuration

.conventional.config.json

```json
{
    "minify": true,
    "sourceMaps": true,
    "sass": {
        "inputFiles": {
            "Main": "./Resources/Private/Sass/Main.scss",
            "Additional": "./Resources/Private/Sass/Additional.scss"
        },
        "outputPath": "./Resources/Public/Css/",
        "outputFilePattern": "[name].min.css"
    },
    "js": {
        "inputFiles": {
            "Main": "./Resources/Private/JavaScript/Main.js",
            "Additional": "./Resources/Private/JavaScript/Additional.js"
        },
        "outputPath": "./Resources/Public/JavaScript/",
        "outputFilePattern": "[name].min.js"
    }
}
```

## Available Commands

```
conventional init

conventional build
conventional build:sass
conventional build:js

conventional watch
conventional watch:sass
conventional watch:js
```

### Planned commands

```
conventional lint
conventional lint:sass
conventional lint:js

conventional test
conventional test:css
conventional test:js
```