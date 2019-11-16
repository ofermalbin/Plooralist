/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT
var apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const environment = process.env.ENV;
const region = process.env.REGION;
const apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT;
const apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;

const UserTable = `User-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;

const
    _ = require('lodash'),
    AWS = require('aws-sdk'),
    ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

  const promises = event.arguments.contacts.map(contact => {

    const params = {
      TableName : UserTable,
      IndexName: 'phoneNumber-index',
      KeyConditionExpression: '#phoneNumber = :phoneNumber',
      ExpressionAttributeNames : {'#phoneNumber' : 'phoneNumber'},
      ExpressionAttributeValues : {':phoneNumber' : contact},
      Limit: 1
    };

    try {
        const data = ddb.query(params).promise();
        return data;
    } catch (error) {
        return error;
    }
  });

  const usersAllData = await Promise.all(promises);
  const users = _.flattenDeep(_.filter(usersAllData, data => data.Items.length).map(data => data.Items));

  console.log('users', JSON.stringify(users));
  return users;
};
