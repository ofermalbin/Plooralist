/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT
var apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;
const appsyncId = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const createStreamMember = require('./query.js').createStreamMember;
const updateStreamMember = require('./query.js').updateStreamMember;
const deleteStreamMember = require('./query.js').deleteStreamMember;
const apiKey = process.env.API_KEY;

const environment = process.env.ENV;

const ddb = new AWS.DynamoDB.DocumentClient();

const PanelTable = `Panel-${appsyncId}-${environment}`;

const _ = require('lodash');

const graphQLfromLambda = async (query, operationName, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
      query: query,
      operationName: operationName,
      variables: variables
  });

  if (apiKey) {
      req.headers["x-api-key"] = apiKey;
  } else {
      const signer = new AWS.Signers.V4(req, "appsync", true);
      signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  const data = await new Promise((resolve, reject) => {
      const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
          result.on('data', (data) => {
              resolve(JSON.parse(data.toString()));
          });
      });

      httpRequest.write(req.body);
      httpRequest.end();
  });

  return data;
}

exports.handler = async (event, context) => {

    const now = new Date();

    let insertItems = [];
    let modifyItems = [];
    let removeItems = [];

    const records = event.Records.map(record => ({
      eventName: record.eventName,
      new: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      old: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
    }));

    records.forEach((record) => {

      console.log('Stream record: ', JSON.stringify(record));

      if (record.eventName == 'INSERT') {
          insertItems.push(record.new);
      }
      else if (record.eventName == 'MODIFY') {
          modifyItems.push(record.new);
      }
      else if (record.eventName == 'REMOVE') {
          removeItems.push(record.old);
      }
    });

    const insertPromises = insertItems.map(item => {
        try {
            const query = createStreamMember;
            const operationName = "createStreamMember";
            const variables = {
                input: _.omit(item, '__typename')
            };
            const data = graphQLfromLambda(query, operationName, variables);
            return data;
        } catch (error) {
            return error;
        }
    });

    const insertAllData = await Promise.all(insertPromises);

    console.log('insertAllData', JSON.stringify(insertAllData));

    const updatePromises = modifyItems.map(item => {
        try {
            const query = updateStreamMember;
            const operationName = "updateStreamMember";
            const variables = {
                input: _.omit(item, '__typename')
            };
            const data = graphQLfromLambda(query, operationName, variables);
            return data;
        } catch (error) {
            return error;
        }
    });

    const updateAllData = await Promise.all(updatePromises);

    console.log('updateAllData', JSON.stringify(updateAllData));

    const deletePromises = removeItems.map(item => {
        try {
            const query = deleteStreamMember;
            const operationName = "deleteStreamMember";
            const variables = {
                input: _.omit(item, '__typename')
            };
            const data = graphQLfromLambda(query, operationName, variables);
            return data;
        } catch (error) {
            return error;
        }
    });

    const deleteAllData = await Promise.all(deletePromises);

    console.log('deleteAllData', JSON.stringify(deleteAllData));

    const members = _.uniqBy(_.concat(insertItems, modifyItems, removeItems), 'memberPanelId');
    console.log('members', JSON.stringify(members));

    const updatePanelsPromises = members.map(item => {

        const params = {
            TableName : PanelTable,
            Key: { id : item.memberPanelId },
            UpdateExpression: 'set updatedAt = :now',
            ExpressionAttributeValues: {
                ':now' : now.toISOString()
            }
        };

        try {
            const data = ddb.update(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const updatePanelsAllData = await Promise.all(updatePanelsPromises);
    console.log('updatePanelsAllData', JSON.stringify(updatePanelsAllData));

    console.log('return');
    return;
};
