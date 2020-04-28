import csvParse from 'csv-parse';
import fs from 'fs';

interface DynamicObject {
  [k: string]: string;
}
export default async function loadCSV(
  filePath: string,
): Promise<DynamicObject[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 1,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: Array<Array<string>> = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  const objKeys = lines[0];
  const data = lines.slice(1);

  const formattedData: DynamicObject[] = [];

  data.forEach(line => {
    const formattedObj: DynamicObject = {};
    line.forEach((value: string, index: number) => {
      formattedObj[objKeys[index]] = value;
    });
    formattedData.push(formattedObj);
  });

  return formattedData;
}
