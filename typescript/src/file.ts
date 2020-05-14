import fs from 'fs';
import readline from 'readline';

export async function getNumber(file: string): Promise<number> {
  const matchNumber = (line: string) => {
    const regex = /^NUMBER=(\d+)$/;
    const match = line.match(regex);
    if (match) {
      return parseInt(match[1]);
    }
    return undefined;
  };

  return new Promise((resolve, reject) => {
    const error = function(error: any) {
      return reject(error);
    };

    const line = function(line: string) {
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
  });
}

async function * getData(file: string, key: string) {
  const matchLine = (line: string) => {
    const regex = new RegExp(`^${key}:(.+)$`);
    return line.match(regex);
  };

  const split = function* (str: string) {
    let pos = 0;
    const number = (end?: number) => parseInt(str.substr(pos, end));
    while (true) {
      const idx = str.indexOf(',', pos);
      if (idx == -1) {
        yield number();
        return;
      }
      yield number(idx);
      pos = idx + 1;
    }
  };

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });

  for await (const line of rl) {
    const match = matchLine(line);
    if (!match) {
      continue;
    }
    yield* split(match[1]);
  }
}

export const getOutput = (filename: string) => getData(filename, 'OUTPUT');
// TODO FIX any
export const  getCollection = (filename: string, num: any) => getData(filename, 'COLLECTION' + num);

