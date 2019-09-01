#!/usr/bin/env node

const { ncp } = require('ncp');
const editJsonFile = require('edit-json-file');
const name = process.argv[2] || 'new-project';

ncp(`${__dirname}/boilerplate`, name, error => {
  if (error) {
    console.log(error);
  } else {
    const file = editJsonFile(`./${name}/package.json`);
    file.set('name', name);
    file.save();

    console.log('Project created!');
  }
});