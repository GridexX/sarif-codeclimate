const fs = require('fs');
const parser = require('./parser');


function converter(options) {
  //Thanks to minimalist cli args are passed in as an object
  /*
  options = {
    _ : [ <input_file_path>, <output_file_path>],
  }
  or
  options = {
    input-file: <input_file_path>,
    output-file: <output_file_path>
  }
  or 
  options = {
    i: <input_file_path>,
    o: <output_file_path>
  }
  
  Return an object with the following properties:
    data: the converted data
    error: any error that occurred
  */
  let input_file_path = null;
  let output_file_path;

  if (options._.length > 0) {
    input_file_path = options._[0];
    if (options._.length > 1) {
      output_file_path = options._[1];
    }
  }
  else if (options['input-file']) {
    input_file_path = options['input-file'];

    if (options['output-file']) {
      output_file_path = options['output-file'];
    }

  } else if (options.i) {
    input_file_path = options.i;

    if (options.o) {
      output_file_path = options.o;
    }

  } else {
    return { data: null, error: "Invalid options, you should pass an input file with -i options" };
  }

  //Read the input file
  let input_sarif_file = null
  try {
    input_sarif_file = fs.readFileSync(input_file_path, 'utf8');
  } catch (e) {
    return { data: null, error: e.message };
  }

  //Convert the SARIF input string into a JSON object
  const { data, error } = parser(input_sarif_file);
  if (error) {
    return { data: null, error: error };
  }

  //Write the output file and return the data
  if (output_file_path) {
    try {
      fs.writeFileSync(output_file_path, JSON.stringify(data, null, 4));
      return { data: data, error: null, savedToFile: output_file_path };
    } catch (e) {
      return { data: null, error: e.message };
    }
  } else {
    return { data: data, error: null };
  }

}

module.exports = converter;