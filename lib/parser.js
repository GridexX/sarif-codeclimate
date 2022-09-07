const crypto = require('crypto');
// Parse the JSON

// Response from the parser
/*
{
  "data": JSON or null
  "error": Error or null
}
*/



//Generate a random md5 hash for the fingerprint
const randomMD5 = () => crypto.createHash('md5').update(Math.random().toString()).digest('hex');


function parser(sarifContent) {

  let sarifObject = null;

  let response = {
    data: [],
    error: null
  }

  try {
    sarifObject = JSON.parse(sarifContent);
  }
  catch (error) {
    response.error = error;
    return error;
  }

  sarifObject.runs.forEach(run => {
    run.results.forEach(result => {

      //Error checking and assigning variables
      let severity = "major";

      if (result.level === "warning") {
        severity = "minor";
      } else if (result.level === "note") {
        severity = "info";
      }

      if (result.message === undefined) {
        response.error = "Message property in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }
      else if (result.message.text === undefined) {
        response.error = "Text property in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }

      if (result.locations === undefined) {
        response.error = "Locations property in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }
      else if (result.locations[0] === undefined) {
        response.error = "First element in locations property in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }
      else if (result.locations[0]?.physicalLocation?.artifactLocation?.uri === undefined) {
        response.error = "Uri property for the location in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }
      else if (result.locations[0]?.physicalLocation?.region?.startLine === undefined) {
        response.error = "StartLine property for the location in Sarif is undefined for object : " + JSON.stringify(result);
        return response;
      }

      response.data.push({
        description: result.message.text.replace("'", ""),
        fingerprint: randomMD5(),
        severity: severity,
        location: {
          //remove file:/ from string
          path: result.locations[0].physicalLocation.artifactLocation.uri.replace("file:/", ""),
          lines: {
            begin: result.locations[0].physicalLocation.region.startLine,
          }
        }
      });
    });
  });

  return response;

}

module.exports = parser;