/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT
var apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const appsyncId = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT;
const region = process.env.REGION;
const environment = process.env.ENV;

const UserTable = `User-${appsyncId}-${environment}`;
const PanelTable = `Panel-${appsyncId}-${environment}`;
const MemberTable = `Member-${appsyncId}-${environment}`;

const uuidv4 = require('uuid/v4');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    const userId = event.userName;

    const getUser = () => {
      const params = {
          TableName : UserTable,
          Key: {
            id: userId
          }
        };

        try {
            const data = ddb.get(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const createUserAndSinglePanel = () => {

      const now = new Date();
      const userItem = {
          __typename: 'User',
          id: userId,
          version: 1,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          active: true,
          identityId: null,
          phoneNumber: event.request.userAttributes.phone_number,
          name: event.request.userAttributes.name,
          email: null,
          locale: 'en',
          imgKey: null,
      };

      const panelId = uuidv4();
      const panelItem = {
          __typename: 'Panel',
          id: panelId,
          version: 1,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          type: 1,
          onlyManagersCreateTask: null,
          onlyManagersEditInfo: null,
          onlyManagersEditMembers: null,
          name: null,
          imgKey: null
      };

      const memberId = uuidv4();
      const memberItem = {
          __typename: 'Member',
          id: memberId,
          version: 1,
          memberPanelId: panelId,
          memberUserId: userId,
          coupleUserId: null,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          owner: true,
          manager: true,
          block: null,
          mute: null,
          pin: true
      };

      const transactItems = {
        TransactItems: [{
          Put: {
            TableName : UserTable,
            Item: userItem
          }
        }, {
          Put: {
            TableName: PanelTable,
            Item: panelItem
          }
        }, {
          Put: {
            TableName: MemberTable,
            Item: memberItem
          }
        }]
      };

      try {
          const data = ddb.transactWrite(transactItems).promise();
          return data;
      } catch (error) {
          return error;
      }
    }

    const userData = await getUser();
    if(!userData.hasOwnProperty('Item')) {
      await createUserAndSinglePanel();
    }

    return event;
};
