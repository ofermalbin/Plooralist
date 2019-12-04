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
const updateStreamMember = require('./query.js').updateStreamMember;
const apiKey = process.env.API_KEY;

const environment = process.env.ENV;

const MemberTable = `Member-${appsyncId}-${environment}`;
const TaskTable = `Task-${appsyncId}-${environment}`;

const _ = require('lodash');

const ddb = new AWS.DynamoDB.DocumentClient();

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

    const scanUpdatePromises = modifyItems.map(item => {

        const params = {
          TableName : MemberTable,
          FilterExpression : 'memberPanelId = :memberPanelId' ,
          ExpressionAttributeValues : {':memberPanelId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanUpdateAllData = await Promise.all(scanUpdatePromises);
    const updateItems = _.flattenDeep(_.filter(scanUpdateAllData, data => data.Items.length).map(data => data.Items));

    const updatePromises = updateItems.map(item => {
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

    const scanRemovePromises = removeItems.map(item => {

        const params = {
          TableName : MemberTable,
          FilterExpression : 'memberPanelId = :memberPanelId' ,
          ExpressionAttributeValues : {':memberPanelId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanRemoveAllData = await Promise.all(scanRemovePromises);

    const deleteItems = _.flattenDeep(_.filter(scanRemoveAllData, data => data.Items.length).map(data => data.Items));

    const deleteItemsChunks = _.chunk(deleteItems, 25);

    const deletePromises = deleteItemsChunks.map(deleteItemsChunk => {

        const DeleteRequests = deleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [MemberTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const allDeleteData = await Promise.all(deletePromises);

    const deleteUnprocessedItems = _.flatten(allDeleteData.filter(deleteData => deleteData.UnprocessedItems && deleteData.UnprocessedItems.DeleteRequest));
    const deleteProcessedItems = _.pullAll(deleteItems, deleteUnprocessedItems);

    console.log('deleteProcessedItems', JSON.stringify(deleteProcessedItems));

    const scanTasksDeletePromises = removeItems.map(item => {

        const params = {
          TableName : TaskTable,
          FilterExpression : 'taskPanelId = :taskPanelId' ,
          ExpressionAttributeValues : {':taskPanelId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanTasksDeleteAllData = await Promise.all(scanTasksDeletePromises);
    const tasksDeleteItems = _.flattenDeep(_.filter(scanTasksDeleteAllData, data => data.Items.length).map(data => data.Items));

    const tasksDeleteItemsChunks = _.chunk(tasksDeleteItems, 25);

    const tasksDeletePromises = tasksDeleteItemsChunks.map(tasksDeleteItemsChunk => {

        const DeleteRequests = tasksDeleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [TaskTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const allTasksDeleteData = await Promise.all(tasksDeletePromises);

    const tasksDeleteUnprocessedItems = _.flatten(allTasksDeleteData.filter(tasksDeleteData => tasksDeleteData.UnprocessedItems && tasksDeleteData.UnprocessedItems.DeleteRequest));
    const tasksDeleteProcessedItems = _.pullAll(tasksDeleteItems, tasksDeleteUnprocessedItems);

    console.log('tasksDeleteProcessedItems', JSON.stringify(tasksDeleteProcessedItems));

    return;
};
