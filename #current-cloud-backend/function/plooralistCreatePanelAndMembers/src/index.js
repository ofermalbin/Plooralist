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

    const panelId = uuidv4();
    const now = new Date();

    const panel = {
        __typename: 'Panel',
        id: panelId,
        version: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        type: event.arguments.type,
        name: event.arguments.name || null,
        imgKey: event.arguments.imgKey || null
    };

    const createPanel = () => {
        const params = {
            TableName: PanelTable,
            Item: panel
        };

        try {
            const data = ddb.put(params).promise();
            return data;
        } catch (error) {
          return error;
        }
    };

    const panelData = await createPanel();

    const params = {
        __typename: 'Member',
        id: null,
        version: 1,
        memberPanelId: panelId,
        memberUserId: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        isOwner: null,
        canAccess: null,
        block: null,
        mute: null,
        pin: null,
    };

    const owners = event.arguments.ownersIds.map(userId => Object.assign({}, params, {id: uuidv4()}, {memberUserId: userId}, {isOwner: true, canAccess: true}));
    const canAccess = event.arguments.canAccessIds.map(userId => Object.assign({}, params, {id: uuidv4()}, {memberUserId: userId}, {canAccess: true}));
    const members = event.arguments.membersIds.map(userId => Object.assign({}, params, {id: uuidv4()}, {memberUserId: userId}));

    const items = _.concat(owners, canAccess, members);

    const itemsChunks = _.chunk(items, 25);

    const promises = itemsChunks.map(itemsChunk => {

        const putRequests = itemsChunk.map(item => {
            return {
                PutRequest: {
                    Item: item
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [MemberTable]: putRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const membersItems = await Promise.all(promises);
    const unprocessedItems = _.flatten(membersItems.filter(member => member.UnprocessedItems && member.UnprocessedItems.PutRequest));
    const processedItems = _.pullAll(items, unprocessedItems);
    return items[0];
};
