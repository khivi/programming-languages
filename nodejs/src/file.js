const {once} = require('events');
const fs = require('fs');
const readline = require('readline');
const Regex = require('regex');
// const fp = require('lodash/fp');

async function getNumber(file) {
  const matchNumber = (line) => {
    const regex = /^NUMBER=(\d+)$/;
    const match = line.match(regex);
    if (match) {
      return parseInt(match[1]);
    }
    return undefined;
  };


  const matchLine = (resolve, reject) => {
    const error = function(error) {
      return reject(error);
    };

    const line = function(line) {
      const number = matchNumber(line);
      if (number) {
        return resolve(number);
      }
      return reject(new Error('Number not found'));
    };

    const rl = readline.createInterface({
      input: fs.createReadStream(file),
    });
    rl.on('error', error);
    rl.once('line', line);
  };

  return new Promise(matchLine);
}

async function getData(file, key) {
  const regex = new Regex(`^${key}:(.+)$`);
  const line = function(line) {
    //const match = line.match(regex);
    /*
    if (!match) {
      return;
    }
    const number = function(number) {
    };
    fp.forEach(fp.split(match[1], ','), number);
    */
  };
  //const error = function(error) {
    //return error;
  //};

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });
  //rl.on('line', line);
  //rl.on('error', error);
  await once(rl, 'close');
  return [2];

}

exports.getNumber = getNumber;
exports.getData = getData;

