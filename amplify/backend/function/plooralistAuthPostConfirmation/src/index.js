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
/*const appsyncId = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT;
const region = process.env.REGION;

const environment = process.env.ENV;*/

const appsyncId = 'bc2yzxkrcfbfxnxeh2gqivfjbq';
const region = 'us-east-1';

const environment = 'dev';

const UserTable = `User-${appsyncId}-${environment}`;

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    const getUser = () => {
      const params = {
          TableName : UserTable,
          Key: {
            id: event.userName
          }
        };

        try {
            const data = ddb.get(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const createUser = () => {

        const now = new Date();
        const user = {
            __typename: 'User',
            id: event.userName,
            version: 1,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            phoneNumber: event.request.userAttributes.phone_number,
            name: event.request.userAttributes.name,
            email: null,
            locale: 'en',
            imgKey: null,
        };
        const params = {
            TableName: UserTable,
            ConditionExpression: "attribute_not_exists(id)",
            Item: user
        };

        try {
            const data = ddb.put(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const userData = await getUser();
    if(!userData.hasOwnProperty('Item')) {
      await createUser();
    }

    return event;
}
