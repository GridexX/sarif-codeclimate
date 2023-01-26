import { ConvertResult, SarifObject } from '..';
import { readFileSync } from 'fs';
import { parse } from './parser';

export function convert(pathToSariFile: string): ConvertResult {
  const result: ConvertResult = {
    errorsFile: [],
    parseResult: undefined,
  };

  try {
    const inputSarifFile = readFileSync(pathToSariFile, 'utf8');
    try {
      const sarifObject: SarifObject = JSON.parse(inputSarifFile);
      result.parseResult = parse(sarifObject);
    } catch (error) {
      result.errorsFile.push('Error while parsing the file, please check the file format.');
    }
  } catch (error) {
    result.errorsFile.push('Error while reading the file, please check the path and the file name.');
  }

  return result;
}
