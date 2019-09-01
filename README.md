# start-project

Global command line tool for initializing new project with webpack boilerplate.

`start-project <name>`

This will create an empty project the current directory. Including the optional name argument will use that project name for the root folder and `package.json`.

The generated project includes webpack, babel, eslint and sass. Sass files named `<file>.module.scss` will be loaded using CSS modules.