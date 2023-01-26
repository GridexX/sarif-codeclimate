import { Command } from 'commander';
import { green, red } from 'colors';
import { writeFileSync } from 'fs';
import { convert } from '../lib/converter';
const program = new Command();

program
  .name('sarif-codeclimate')
  .description('Converts a SARIF file to a Code Climate JSON file')
  .version('2.0.0')
  .requiredOption('-i, --input <path>', 'Path to the SARIF file')
  .option('-o, --output <path>', 'Path to the Code Climate JSON file')
  .action((options) => {
    const { input, output } = options;
    const convertResult = convert(input);
    const data = convertResult.parseResult?.data ?? [];

    // Display errors from the file if any
    if (convertResult.errorsFile.length > 0) {
      console.log(red('Errors with the input file:'));
      convertResult.errorsFile.forEach((error) => {
        console.log(red(error));
      });
    }

    // Save the result of the parsing if any
    if (data.length > 0) {
      const resultFile = output ?? './codeclimate.json';
      try {
        writeFileSync(resultFile, JSON.stringify(data, null, 4));
        console.log(green(`The output file has been written to ${resultFile}`));
      } catch (error) {
        console.log(red('Error while writing the output file'));
      }
    }

    // Display errors from the parser if debug mode is enabled
    const parsingErrors = convertResult.parseResult?.errors ?? [];
    if (
      parsingErrors.length > 0 &&
      (process.env.DEBUG === 'true' || process.env.DEBUG === '1' || process.env.LOG_LEVEL === 'debug')
    ) {
      console.log(red('Errors with the parsing:'));
      parsingErrors.forEach((error) => {
        console.log(red(error));
      });
    }
  });

program.parse();
