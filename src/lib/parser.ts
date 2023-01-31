import { ParserData, ParseResult, SarifObject, Severity } from '..';
import { createHash } from 'crypto';

// Generate a random md5 hash for the fingerprint
const randomMD5 = (): string => createHash('md5').update(Math.random().toString()).digest('hex');

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

      const data: ParserData = {
        description: result?.message?.text ?? '',
        fingerprint: randomMD5(),
        severity,
        location: {
          path: result.locations?.at(0)?.physicalLocation?.artifactLocation?.uri?.replace('file:', '') ?? '',
          lines: {
            begin: result.locations?.at(0)?.physicalLocation?.region?.startLine ?? 0,
          },
        },
      };

      response.data.push(data);
    });
  });

  return response;
}
