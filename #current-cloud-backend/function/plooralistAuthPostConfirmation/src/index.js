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
          isOwner: true,
          canAccess: true,
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

    /*const createUser = () => {

        const now = new Date();
        const user = {
            __typename: 'User',
            id: userId,
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
    };*/

    const userData = await getUser();
    if(!userData.hasOwnProperty('Item')) {
      await createUserAndSinglePanel();
    }

    return event;
}
