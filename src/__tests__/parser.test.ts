import { parse } from '../lib/parser';
import { readFileSync } from 'fs';
import { SarifObject, SarifRunResult } from '..';

describe('Read a SARIF file', () => {
  it('should parse the correct file as a JSON', () => {
    const sarifFile = readFileSync('./src/__tests__/data/correct-sarif.json', 'utf8');
    const sarifObject = JSON.parse(sarifFile);
    expect(sarifObject).toBeDefined();
  });

  it('should return an error if the file is not a SARIF file', () => {
    const sarifFile = readFileSync('./src/__tests__/data/incorrect-sarif.json', 'utf8');
    try {
      JSON.parse(sarifFile);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('Parse a SARIF file', () => {
  const sarifFile = readFileSync('./src/__tests__/data/sample.sarif.json', 'utf8');
  const sarifJsonObject: SarifObject = JSON.parse(sarifFile);
  const sarifObject = parse(sarifJsonObject);
  const data = sarifObject.data ?? [];
  it('Location strips the file path', () => {
    const data = sarifObject.data ?? [];
    data.forEach((item) => {
      expect(item?.location.path).not.toContain('file:');
    });
  });
  it('Location path is not empty', () => {
    const data = sarifObject.data ?? [];
    data.forEach((item) => {
      expect(item?.location.path).not.toEqual('');
    });
  });
  it('Location path is not undefined', () => {
    const data = sarifObject.data ?? [];
    data.forEach((item) => {
      expect(item?.location.path).not.toBeUndefined();
    });
  });
  it('Location and lines begin match', () => {
    const result = sarifJsonObject.runs[0].results[0];
    expect(result.locations?.at(0)?.physicalLocation?.artifactLocation?.uri?.replace('file:', '')).toEqual(
      data[0].location.path,
    );
    expect(result.locations?.at(0)?.physicalLocation?.region?.startLine).toEqual(data[0].location.lines.begin);
  });
  it('Transfer the text into the description', () => {
    const result = sarifJsonObject.runs[0].results[0];
    expect(result.message?.text).toEqual(data[0].description);
  });
  it('Missing value are replaced with default value', () => {

    const jsonObject = sarifJsonObject.runs.flatMap((run) => run.results);
    const lineWithoutStartLine = jsonObject.filter((result) => result.locations?.at(0)?.physicalLocation?.region?.startLine === undefined)
    // This is a cell with missing startLine Info
    lineWithoutStartLine.forEach((result) => {
      const dataResult = data.find((r) => r.description === result.message?.text);
      expect(dataResult?.location.lines.begin).toEqual(0);
    });
  });

  it('Severity level match the expected', () => {
    expect(sarifObject.data[0]?.severity).toEqual('minor');
  });
  it('Severity level match the expected', () => {
    expect(sarifObject.data[2]?.severity).toEqual('info');
  });
});
