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
* SVG-Spritemap generation from single SVG files, optionally with name-prefixes
* Integration of purgeCSS functionality

### Planned features

* Autoprefixing of CSS classes (similar to CSS modules) for selected sass files

## Usage

```
npx @sitegeist/conventional init
```

* Outputs instructions to install conventional via npm or yarn
* Creates default `conventional.config.json`

After the setup procedure, your package.json should look something like this:

```json
{
   "scripts": {
       "build": "conventional build",
       "watch": "conventional watch",
       "lint": "conventional lint"
   },
   "devDependencies": {
       "@sitegeist/conventional": "^1.4"
   }
}
```

## Installation with ddev and M1 CPU

For the usage in an apple environment with M1 CPU or other installation issues add these packages to your .ddev/config.yaml

```
webimage_extra_packages: [python-dev, build-essential]
```

In case you manually added the conventional package to your package.json and you might want to do a 'yarn install' or 'npm install' use this flags when you get issues with node-sass

```
CXXFLAGS="--std=c++17" yarn install --network-concurrency 1
CXXFLAGS="--std=c++17" npm install --network-concurrency 1
```

## Configuration

All configuration is done in conventional.config.json in your package root folder:

```json
{
    "minify": true,
    "sourceMaps": true,
    "autoprefixer": true,
    "browserUpdateNote": false,
    "sass": {
        "inputFiles": {
            "Main": "./Resources/Private/Sass/Main.scss",
            "Additional": "./Resources/Private/Sass/Additional.scss",
            "Glob": "./Resources/Private/Sass/*.scss"
        },
        "outputPath": "./Resources/Public/Css/",
        "outputFilePattern": "[name].min.css",
        "purgeFiles": [
            "./Resources/Private/Components/**/*.html",
            "./Resources/Private/Templates/**/*.html",
            "./Resources/Private/JavaScript/**/*.js"
        ],
        "purgeSafelist": ["html", "body"]
    },
    "less": {
        "inputFiles": {
            "Main": "./Resources/Private/Less/Main.less"
        },
        "outputPath": "./Resources/Public/Css/",
        "outputFilePattern": "[name].min.css"
    },
    "js": {
        "inputFiles": {
            "Main": "./Resources/Private/JavaScript/Main.js",
            "Additional": "./Resources/Private/JavaScript/Additional.js",
            "Glob": "./Resources/Private/JavaScript/*.js"
        },
        "outputPath": "./Resources/Public/JavaScript/",
        "outputFilePattern": "[name].min.js"
    },
    "ts": {
        "inputFiles": {
            "MainFromTs": "./Resources/Private/JavaScript/*.ts"
        },
        "outputPath": "./Resources/Public/JavaScript/",
        "outputFilePattern": "[name].min.js"
    }
}
```

see also [conventional.config.json](./lib/templates/conventional.config.json)

### Stylelint configuration
By default, conventional uses the stylelint-config-sass-guidelines. To add your own configuration, place a .stylelintrc.json file into your project root. You can add a complete custom set of rules or extend the standard-rules like this:
```json
{
  "extends": "stylelint-config-sass-guidelines",
  "rules": {
    "indentation": "tab",
    "number-leading-zero": null
  }
}
```

### TypeScript configuration
To configure the TypeScript settings, a tsconfig.json can be placed in your project root. A sample setting could look like this:
```json
{
    "compilerOptions": {
        "noImplicitAny": true,
        "module": "es6",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "moduleResolution": "node"
    }
}
```

### purgeCSS
To run purgeCSS on your sass files, add purgeFiles (path or array of paths incl. glob) to the sass section of your conventional.config.json. Only classes/IDs used in those files will be kept in your output CSS. Note: Enabling this option may reduce the building speed significantly, depending on the size of your project.
purgeSafelist can take the different safelist patterns as described here: https://purgecss.com/configuration.html. It just needs to be converted to .json formatting.

## Available Commands

```
conventional init

conventional build
conventional build:sass
conventional build:less
conventional build:js
conventional build:ts
conventional build:spritemap

conventional watch
conventional watch:sass
conventional watch:less
conventional watch:js
conventional watch:ts
conventional watch:spritemap

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
