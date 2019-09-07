# simple-webpack-starter

Global command line tool for initializing new project with webpack boilerplate. The generated project includes webpack, live reloading, babel, eslint and sass. Sass files named `<file>.module.scss` will be loaded using CSS modules.

## Installation

`npm install -g simple-webpack-starter`

## Creating a new project

```
start-project <name>
```

This will create an empty project and install its dependencies. Including the optional name argument will use that project name for the root folder and `package.json`. If no project name is provided it will default to `new-project`.

## Development

In your project's root folder, run `npm run start` to launch the development server. By default your application will be served from port `8888`. You can change this by editing the port number in `webpack.dev.js`.

## Building your application

Running `npm run build` will create a minified production bundle inside the `dist` folder. You can preview your production application by running `npm run preview`.