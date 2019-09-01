# simple-webpack-starter

Global command line tool for initializing new project with webpack boilerplate. The generated project includes webpack, babel, eslint and sass. Sass files named `<file>.module.scss` will be loaded using CSS modules.

## Installation

`npm install -g simple-webpack-starter`

## Creating a new project

```
start-project <name>
cd <name>
npm install
```

This will create an empty project the current directory. Including the optional name argument will use that project name for the root folder and `package.json`. If no project name is provided it will default to `new-project`