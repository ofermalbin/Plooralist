/*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/

/*exports.handler = (event, context, callback) => {
  const modules = process.env.MODULES.split(',');
  for (let i = 0; i < modules.length; i += 1) {
    const { handler } = require(modules[i]);
    handler(event, context, callback);
  }
};*/


const AWS = require("aws-sdk");
const environment = process.env.ENV;

const functionName = `plooralistCreateUserAndSinglePanel-${environment}`;

const lambda = new AWS.Lambda();

exports.handler = async (event, context) => {

  const invokeFunction = () => {
      const params = {
        FunctionName: functionName,
        Payload: JSON.stringify(event)
      };

      try {
          const data = lambda.invoke(params).promise();
          return data;
      } catch (error) {
          return error;
      }
  };

  const functionData = await invokeFunction();

  return event;
}
