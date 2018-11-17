const fs = require('fs');

function createSrcFile(path, filename, name) {
  fs.appendFile(
    `${path}${filename}`,
    `export const ${name} = (bot) => {
        bot.hear(/hello/i, (res) => {
          res.send('Hello World');
        });
      
        bot.respond(/hello/i, (res) => {
          res.send('Hello World responsding');
        });
      };`,
    (err) => {
      if (err) {
        console.warn('Kunne ikke opprette filen');
        console.warn(err);
      } else {
        console.info(`${filename} opprettet`);
      }
    },
  );
}

function createIndexFile(path, filename, name) {
  fs.appendFile(
    `${path}${filename}`,
    `const {${name}} = require('../dist/${name}');
    
module.exports = ${name}`,
    (err) => {
      if (err) {
        console.warn('Kunne ikke opprette filen');
        console.warn(err);
      } else {
        console.info(`${filename} opprettet`);
      }
    },
  );
}

const filename = process.argv[2];
const name = process.argv[3];

if (!filename || !name) {
  console.warn('Du må spesifisere filnavn og et navn');
  process.exit(1);
}

createSrcFile('src/', filename, name);
createIndexFile('scripts/', filename, name);
