**Note: This is currently work in progress.**

# @sitegeist/conventional

Frontend toolchain for sitegeist TYPO3 projects

## Features

* Bundles sitegeist's frontend toolchain for TYPO3 projects (with and without fluid components)
* Enables centralized design tokens in a json/json5 file which can be used in sass files,
 javascript as well as TYPO3 and fluid components
* Easy imports of multiple sass/js files via glob
* Autoprefixing of CSS classes (similar to CSS modules) for selected sass files
* Autoprefixing of new CSS properties for older browsers (respects browserslist of project)
* Automatic polyfills for new JavaScript features with babel (respects browserslist of project)
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
  "sourceMaps": true,
  "prefixSalt": "sitegeist",
  "prefixOutputFile": "./Resources/Public/css/All.prefix.json",
  "scssWatchDir": "./Resources/Private",
  "css": [
    {
      "outputStyle": "compressed", 
      "inputFile": "./Resources/Private/scss/Main.scss",
      "outputFile": "./Resources/Public/css/Main.min.css"
    },
    {
      "outputStyle": "nested",
      "inputFile": "./Resources/Private/scss/Additional.scss",
      "outputFile": "./Resources/Public/css/Additional.min.css"
    }
  ],
  "js": {
    "minify": true,
    "inputFiles": {
      "Main": "./Resources/Private/JavaScript/Main.js",
      "Additional": "./Resources/Private/JavaScript/Additional.js"
    },
    "outputPath": "./Resources/Public/JavaScript/",
    "outputFilePattern": "[name].min.js"
  },
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
