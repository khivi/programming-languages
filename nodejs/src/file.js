const fs = require('fs');
const readline = require('readline');

async function getNumber(file) {
  const matchNumber = (line) =>  {
      const regex = /^NUMBER=(\d+)$/;
      const match = line.match(regex);
      return match? parseInt(match[1]): undefined;
  };

  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  const matchLine = (resolve, reject) => {
    lineReader.once('line', function(line) {
      const number = matchNumber(line);
      number? resolve(number): reject(new Error("Number not found"));
    });
  };

  return new Promise(matchLine);
}

exports.getNumber = getNumber;

