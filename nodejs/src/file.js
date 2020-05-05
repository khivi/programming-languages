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

  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  const matchLine = (resolve, reject) => {
    lineReader.once('line', function(line) {
      const number = matchNumber(line);
      if (number) {
        return resolve(number);
      }
      return reject(new Error('Number not found'));
    });
  };

  return new Promise(matchLine);
}

exports.getNumber = getNumber;

