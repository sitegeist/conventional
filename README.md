# @sitegeist/conventional

Bundles sitegeist's frontend toolchain for TYPO3 projects (with and without [fluid-components](https://github.com/sitegeist/fluid-components))

## Features

* Enables centralized design tokens in a json/json5 file which can be used in sass files,
 javascript as well as TYPO3 and fluid components
* Easy imports of multiple sass/js files via glob
* Automatic polyfills for new JavaScript features with babel (respects browserslist of project)
* Minifies frontend assets and generates source map files
* Browser Update Note
* Stylelint for (CSS, SASS, SCSS) and Standard Linting (JS)
* Autoprefixing of modern CSS properties for older browsers (respects browserslist of project)

### Planned features

* Autoprefixing of CSS classes (similar to CSS modules) for selected sass files
* Builds SVG sprites from folders of individual svg files
* Integrated linting toolchain for SASS and JS files

## Usage

```
npx @sitegeist/conventional init
```

* Outputs instructions to install conventional
* Creates default `conventional.config.json`

After the setup procedure, your package.json should look something like this:

```json
{
   "scripts": {
       "build": "conventional build",
       "watch": "conventional watch"
   },
   "devDependencies": {
       "@sitegeist/conventional": "^1.0"
   }
}
```

## Configuration

All configuration is done in conventional.config.json in your package root folder:

```json
{
    "minify": true,
    "sourceMaps": true,
    "autoprefixer": true,
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

see also [conventional.config.json](./lib/templates/conventional.config.json)

## Available Commands

```
conventional init

conventional build
conventional build:sass
conventional build:js

conventional watch
conventional watch:sass
conventional watch:js

conventional lint
conventional lint:sass
conventional lint:js
```

### Planned commands

```
conventional test
conventional test:css
conventional test:js
```
