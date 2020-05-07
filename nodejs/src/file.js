const fs = require('fs');
const readline = require('readline');

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

async function* getData(file, key) {
  const matchLine = (line) => {
    const regex = new RegExp(`^${key}:(.+)$`);
    return line.match(regex);
  }
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });
  for await (const line of rl) {
    const match = matchLine(line);
    if (!match) {
      continue;
    }
    for (const n of match[1].split(',')) {
      yield parseInt(n);
    }
  }
}

exports.getNumber = getNumber;
exports.getData = getData;

