import fs from 'fs';
import readline from 'readline';

export async function getNumber(file: string): Promise<number> {
  const matchNumber = (line: string) => {
    const regex = /^NUMBER=(\d+)$/;
    const match = regex.exec(line);
    if (match) {
      return Number.parseInt(match[1], 10);
    }

    return undefined;
  };

  return new Promise((resolve, reject) => {
    const error = function (error: any) {
      return reject(error);
    };

    const line = function (line: string) {
      const number = matchNumber(line);
      if (number) {
        return resolve(number);
      }

      return reject(new Error('Number not found'));
    };

    const rl = readline.createInterface({
      input: fs.createReadStream(file)
    });
    rl.on('error', error);
    rl.once('line', line);
  });
}

async function * getData(file: string, key: string) {
  const matchLine = (line: string) => {
    const regex = new RegExp(`^${key}:(.+)$`);
    return regex.exec(line);
  };

  const split = function * (string: string) {
    let pos = 0;
    const number = (end?: number) => Number.parseInt(string.slice(pos, end), 10);
    while (true) {
      const idx = string.indexOf(',', pos);
      if (idx === -1) {
        yield number();
        return;
      }

      yield number(idx);
      pos = idx + 1;
    }
  };

  const rl = readline.createInterface({
    input: fs.createReadStream(file)
  });

  for await (const line of rl) {
    const match = matchLine(line);
    if (!match) {
      continue;
    }

    yield * split(match[1]);
  }
}

export const getOutput = (filename: string) => getData(filename, 'OUTPUT');
export const getCollection = (filename: string, number: number) => getData(filename, `COLLECTION${number}`);

