import { ParserData, ParseResult, SarifObject, Severity } from '..';
import { createHash } from 'crypto';

// Generate a random md5 hash for the fingerprint
const createMD5 = (input: string): string => createHash('md5').update(input).digest('hex');

export function parse(sarifObject: SarifObject): ParseResult {
  const response: ParseResult = {
    success: true,
    data: [],
    errors: [],
  };

  sarifObject.runs.forEach((run) => {
    run.results.forEach((result) => {
      if (result.message === undefined) {
        response.errors.push('Message property in Sarif is undefined for object : ' + JSON.stringify(result));
      } else if (result?.message?.text === undefined) {
        response.errors.push('Text property in Sarif is undefined for object : ' + JSON.stringify(result));
      }

      if (result.locations === undefined) {
        response.errors.push('Locations property in Sarif is undefined for object : ' + JSON.stringify(result));
      } else if (result.locations[0] === undefined) {
        response.errors.push(
          'First element in locations property in Sarif is undefined for object : ' + JSON.stringify(result),
        );
      } else if (result.locations[0]?.physicalLocation?.artifactLocation?.uri === undefined) {
        response.errors.push(
          'Uri property for the location in Sarif is undefined for object : ' + JSON.stringify(result),
        );
      } else if (result.locations[0]?.physicalLocation?.region?.startLine === undefined) {
        response.errors.push(
          'StartLine property for the location in Sarif is undefined for object : ' + JSON.stringify(result),
        );
      }

      let severity: Severity = 'major';

      if (result.level === 'warning') {
        severity = 'minor';
      } else if (result.level === 'note') {
        severity = 'info';
      }

      const description = result?.message?.text ?? '';
      const path = result.locations?.at(0)?.physicalLocation?.artifactLocation?.uri?.replace('file:', '') ?? '';
      const begin = result.locations?.at(0)?.physicalLocation?.region?.startLine ?? 0;

      const data: ParserData = {
        description,
        fingerprint: createMD5(`${description} ${path} ${begin}`),
        severity,
        location: {
          path,
          lines: {
            begin,
          },
        },
      };

      response.data.push(data);
    });
  });

  return response;
}
