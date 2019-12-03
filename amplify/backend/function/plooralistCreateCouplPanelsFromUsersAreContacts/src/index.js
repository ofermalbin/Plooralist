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

const PanelTable = `Panel-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const MemberTable = `Member-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;

const
    _ = require('lodash'),
    uuidv4 = require('uuid/v4'),
    AWS = require('aws-sdk'),
    ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    const usersIds = event.arguments.usersIds;
    const userId = event.identity.username;
    console.log('usersIds', JSON.stringify(usersIds));
    console.log('userId', JSON.stringify(userId));

    const getCouplesMembers = () => {
        const params = {
            TableName: MemberTable,
            IndexName: 'gsi-UserMembers',
            KeyConditionExpression: 'memberUserId = :userId',
            FilterExpression: '#type = :type',
            ExpressionAttributeNames: {
              '#type': 'type',
            },
            ExpressionAttributeValues: {
              ':userId': userId,
              ':type': 2
            },
        };

        try {
            const data = ddb.query(params).promise();
            return data;
        } catch (error) {
          return error;
        }
    };

    const membersData = await getCouplesMembers();
    const members = membersData.Items;
    console.log('members', JSON.stringify(members));
    const membersCouplesMUsersIds = members.map(member => member.coupleUserId);
    console.log('membersCouplesMUsersIds', JSON.stringify(membersCouplesMUsersIds));
    console.log('difference', JSON.stringify(_.difference(usersIds, membersCouplesMUsersIds)));

    const promises = _.difference(usersIds, membersCouplesMUsersIds).map(coupleUserId => {

      const now = new Date();
      const panelId = uuidv4();

      const panelItem = {
          __typename: 'Panel',
          id: panelId,
          version: 1,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          type: 2,
          name: null,
          imgKey: null
      };

      const memberParams = {
          __typename: 'Member',
          id: null,
          version: 1,
          memberPanelId: panelId,
          memberUserId: null,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          isOwner: true,
          canAccess: true,
          block: null,
          mute: null,
          pin: null,
      };

      const userItem = Object.assign({}, memberParams, {id: uuidv4()}, {memberUserId: userId});
      const coupleItem = Object.assign({}, memberParams, {id: uuidv4()}, {memberUserId: coupleUserId});

      const params = {
        TransactItems: [{
          Put: {
            TableName : PanelTable,
            Item: panelItem,
            ConditionExpression: "attribute_not_exists(id)",
          }
        }, {
          Put: {
            TableName: MemberTable,
            Item: userItem
          }
        }, {
          Put: {
            TableName: MemberTable,
            Item: coupleItem
          }
        }]
      };

      try {
          const data = ddb.transactWrite(requestItems).promise();
          return data;
      } catch (error) {
          return error;
      }
    });

    const membersItems = await Promise.all(promises);
    return;
};
