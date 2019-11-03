/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT
var apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT
var analyticsPlooralistPinpointId = process.env.ANALYTICS_PLOORALISTPINPOINT_ID
var analyticsPlooralistPinpointRegion = process.env.ANALYTICS_PLOORALISTPINPOINT_REGION

Amplify Params - DO NOT EDIT */

const environment = process.env.ENV;
const region = process.env.REGION;
const apiPlooralistGraphQLGraphQLAPIIdOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIIDOUTPUT;
const apiPlooralistGraphQLGraphQLAPIEndpointOutput = process.env.API_PLOORALISTGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;
const analyticsPlooralistPinpointId = process.env.ANALYTICS_PLOORALISTPINPOINT_ID;
const analyticsPlooralistPinpointRegion = process.env.ANALYTICS_PLOORALISTPINPOINT_REGION;

const TaskTable = `Task-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const PlaceNotificationTable = `PlaceNotification-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;

const
    _ = require('lodash'),
    AWS = require('aws-sdk'),
    ddb = new AWS.DynamoDB.DocumentClient(),
    pinpoint = new AWS.Pinpoint();

const defaultParamsMessage = {
    Action: 'OPEN_APP',
    SilentPush: false,
};

const whenTypes = ['entered', 'exited'];

exports.handler = async (req, context) => {
    //console.log('req', JSON.stringify(req));
    const body = JSON.parse(req.body);
    let events = body.events;
    console.log(events);
    events = _.filter(events, event => event.geofence && event.geofence.tag);

    const eventsChunks = _.chunk(events, 100);

    const placeNotificationsPromises = eventsChunks.map(eventsChunk => {

        const Keys = eventsChunk.map(event => {
            return {
                id: event.geofence.tag
            };
        });

        const requestItems = {
            RequestItems: {
                [PlaceNotificationTable]: {
                    Keys: Keys
                }
            }
        };

        try {
            const data = ddb.batchGet(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const placeNotificationsAllData = await Promise.all(placeNotificationsPromises);

    console.log('placeNotificationsAllData', JSON.stringify(placeNotificationsAllData));

    const placeNotificationsUnprocessedKeys = _.flatten(_.filter(placeNotificationsAllData, placeNotificationData => placeNotificationData.UnprocessedKeys));

    const placeNotifications = _.flattenDeep(_.filter(placeNotificationsAllData, data => data.Responses[PlaceNotificationTable].length).map(data => data.Responses[PlaceNotificationTable]));

    console.log('placeNotifications', JSON.stringify(placeNotifications));

    const scanTasksPromises = placeNotifications.map(item => {

        const params = {
          TableName : TaskTable,
          FilterExpression : 'id = :placeNotificationTaskId',
          ExpressionAttributeValues : {':placeNotificationTaskId' : item.placeNotificationTaskId}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const tasksPromisesAllData = await Promise.all(scanTasksPromises);
    const tasks = _.uniqBy(_.flattenDeep(_.filter(tasksPromisesAllData, data => data.Items.length).map(data => data.Items)), 'id');

    const placeNotificationsGroupByID = _.groupBy(placeNotifications, 'id');

    console.log('placeNotificationsGroupByID', JSON.stringify(placeNotificationsGroupByID));

    const placeNotificationsMessages = _.filter(events, event => placeNotificationsGroupByID[event.geofence.tag] && (_.find(placeNotificationsGroupByID[event.geofence.tag], placeNotification => placeNotification.when === _.findIndex(whenTypes, whenType => (whenType === event.type.slice(5,-9))) ))).map(event => {

        const task = _.find(tasks, t => t.id == placeNotificationsGroupByID[event.geofence.tag][0].placeNotificationTaskId);

        if (task.completed) {
            return null;
        }

        const membersAreMute = (task.membersAreMute && task.membersAreMute.values) ? task.membersAreMute.values : null;
        if (membersAreMute && membersAreMute.length && (_.indexOf(membersAreMute, event.user.userId) > -1)) {
            return null;
        }

        const message = {
            ...defaultParamsMessage,
            Title: task.name,
            Body: `${'Place Notification'}${'\n'}${event.type.slice(5,-9)}${'\n'}${event.geofence.description}`
        };
        return {
            ApplicationId: analyticsPlooralistPinpointId,
            SendUsersMessageRequest: {
                Users: {[event.user.userId]: {}},
                MessageConfiguration: {
                    APNSMessage: message,
                    GCMMessage: message
                }
            }
        };
    });

    console.log('placeNotificationsMessages', JSON.stringify(placeNotificationsMessages));

    const sendPlaceNotificationsPromises = _.compact(placeNotificationsMessages).map(message => {
        try {
            const data = pinpoint.sendUsersMessages(message).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const sendPlaceNotificationsAllData = await Promise.all(sendPlaceNotificationsPromises);

    console.log('sendPlaceNotificationsAllData', JSON.stringify(sendPlaceNotificationsAllData));


    return;
};
