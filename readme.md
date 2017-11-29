# OD Frontend

This toolkit generates your project's frontend build system. It uses Webpack
under the hood.

## Features

* JS (Babel, Eslint, Babel-Polyfill). Can import relative to project root:
  `import x from 'client/js/y'`
* SCSS with autoprefixer, normalize.css
* Hot reload for development
* Works with zero configuration, but customization is possible if needed

## Usage

1. Install the toolkit globally: `npm install -g @optimistdigital/od-frontend`
2. Type `od-create-frontend` in your project root and follow the instructions

### CLI

* `npm run dev` - Start a webpack server for development
* `npm run build` - Build assets for production
* `npm run build:debug` - Build assets with debug logs. In JS, `__DEBUG__` will
  be [transformed](https://webpack.js.org/plugins/define-plugin/) to `true`

There are also flags to customize the dev environment:

* `npm run dev -- --webpackPort=8000` - Custom port for dev server
* `npm run dev -- --webpackDomain=localhost` - Custom domain for dev server
* `npm run dev -- --protocol=https` - Run the dev server with https

### Configuration

Configuration goes in the your package.json under the `od-frontend` field
(default in parens):

* `publicDirectory` (_public_) - Project's public root. Relative to project
  root.
* `buildPath` (_build_) - Where the build files will go. Relative to the public
  directory.
* `entryPoints` - Object/string/array that contains the
  [entry points](https://webpack.js.org/concepts/entry-points/) for your
  application. Relative to project root. Default:
  ```js
  {
      app: 'client/js/entry.js',
  }
  ```
* `hashFileNames` (_true_) - Whether or not filenames should be hashed in
  production (e.g `app-503dcc37.js`). An `asset-manifest.json` file will be
  generated either way.

### Using hot module replacement

[Hot module replacement](https://webpack.js.org/api/hot-module-replacement/) is
enabled for the app, however you must choose manually what you want to update
when changes are made. To do this, go into your `entry.js` file and uncomment
the relevant code.

## Project structure

* `/client` - your frontend source code lives here. Can be configured with
  `entryPoints`
* `/public/build` - your production code will be built here.
* `/asset-manifest.json` - this file is generated automatically, and contains
  the paths for your app entry points. Use this to link the assets in your
  backend.
* `.eslintrc` - [Eslint](https://webpack.js.org/api/hot-module-replacement/)
  configuration.
* `.prettierrc` - [Prettier](https://prettier.io/) configuration.

# Contributing

To develop this toolkit, you need to make a test project where you will be using
this generator. You also need to symlink this project so your test project
installs the local version, instead of from npm.

* `npm install` - install node modules
* `npm link` while in this directory - makes `od-create-frontend` accesible
  globally
* Go to your test project and type `od-create-frontend --dev`

```

```
