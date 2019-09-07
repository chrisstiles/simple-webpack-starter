#!/usr/bin/env node

const fs = require('fs-extra');
const Confirm = require('prompt-confirm');
const editJsonFile = require('edit-json-file');
const { exec } = require('child_process');
const colors = require('colors');
const ora = require('ora');
const name = process.argv[2] || 'new-project';
const projectPath = `./${name}`;

if (fs.existsSync(projectPath)) {
  console.log('The folder '.yellow + `/${name}`.magenta.bold + ' already exists. Creating a project here will erase the previous contents of that folder.\n'.yellow)
  const prompt = new Confirm('Would you like to continue?');

  prompt.ask(answer => {
    if (answer) {
      fs.emptyDir(projectPath, error => {
        if (error) {
          console.error(error);
        } else {
          createProject();
        }
      });
    }
  });
} else {
  createProject();
}

function createProject() {
  console.log('\nCreating project...');

  fs.copy(`${__dirname}/boilerplate`, name, error => {
    if (error) {
      console.error(error);
      console.log('\n Unable to create project'.red);
    } else {
      // Set project name in package.json
      const file = editJsonFile(`${projectPath}/package.json`);
      file.set('name', name);
      file.save();

      console.log('\nProject created in ' + `/${name}\n`.magenta.bold);

      const spinner = ora({
        text: 'Installing dependencies',
        stream: process.stdout
      }).start();

      exec(`npm install`, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          spinner.warn('Your project was created but there was a problem installing dependencies');
          console.log('\nYou can install them manually by running ' + 'npm install'.cyan + ' in your project folder.');
        } else {
          const packageText = stdout.match(/(added.*\ds)/);

          if (packageText && packageText.length) {
            const text = packageText[0].charAt(0).toUpperCase() + packageText[0].slice(1);
            spinner.succeed(text);
          } else {
            spinner.succeed('Dependencies already installed');
          }
        }

        console.log('\nDone!\n'.green.bold);
        console.log('To start the development servier run ' + 'npm run start'.cyan + ' in your project folder.\n');
      });
    }
  });
}