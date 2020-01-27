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

const PanelTable = `Panel-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const MemberTable = `Member-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const TaskTable = `Task-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const SubtaskTable = `Subtask-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
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

    console.log('req', JSON.stringify(req));
    const event = req.event;

    const userId = event.user.userId;
    const placeNotificationId = event.geofence ? event.geofence.tag : null;
    const when = event.type.slice(5,-9);
    const description = event.geofence.description;

    const getPlaceNotification = async (placeNotificationId) => {
      const params = {
          TableName : PlaceNotificationTable,
          Key: {
            id: placeNotificationId
          }
        };

        try {
            const data = ddb.get(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const getTask = async (taskId) => {
      const params = {
          TableName : TaskTable,
          Key: {
            id: taskId
          }
        };

        try {
            const data = ddb.get(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const getMembers = async (userId, panelId) => {
        const params = {
            TableName: MemberTable,
            IndexName: 'gsi-UserMembers',
            KeyConditionExpression: 'memberUserId = :userId',
            FilterExpression: 'memberPanelId = :panelId',
            ExpressionAttributeValues: {
              ':userId': userId,
              ':panelId': panelId,
            }
        };

        try {
            const data = ddb.query(params).promise();
            return data;
        } catch (error) {
          return error;
        }
    };

    const getSubtasks = async (taskId) => {
        const params = {
            TableName: SubtaskTable,
            IndexName: 'gsi-TaskSubtasks',
            KeyConditionExpression: 'subtaskTaskId = :taskId',
            ExpressionAttributeValues: {
              ':taskId': taskId
            }
        };

        try {
            const data = ddb.query(params).promise();
            return data;
        } catch (error) {
          return error;
        }
    };

    const sendUserMessage = async (userId, task, subtasks, type, description) => {

      const subtasksMessage = _.join(subtasks.map(subtask => `${subtask.name}${subtask.completed ? ' ✔️' : ''}`), '\n');

      const message = {
          ...defaultParamsMessage,
          Title: task.name,
          Body: `${description}${'\n'}${(subtasksMessage && subtasksMessage.length) ? subtasksMessage : ''}`,
          Data: {
              objType: 'task',
              objId: task.id
          }
      };

      const userMessages = {
          ApplicationId: analyticsPlooralistPinpointId,
          SendUsersMessageRequest: {
              Users: {[userId]: {}},
              MessageConfiguration: {
                  APNSMessage: message,
                  GCMMessage: message
              }
          }
      };

      try {
          const data = pinpoint.sendUsersMessages(userMessages).promise();
          return data;
      } catch (error) {
          return error;
      }
    };

    const placeNotificationItem = await getPlaceNotification(placeNotificationId);
    console.log('placeNotificationItem', JSON.stringify(placeNotificationItem));
    if (!placeNotificationItem || !placeNotificationItem.Item ) {
      return null;
    }
    const placeNotification = placeNotificationItem.Item;

    if(placeNotification.when !== _.findIndex(whenTypes, whenType => (whenType === when))) {
      return null;
    }

    const taskItem = await getTask(placeNotification.placeNotificationTaskId);
    console.log('taskItem', JSON.stringify(taskItem));
    if (!taskItem || !taskItem.Item || taskItem.Item.completed) {
      return null;
    }
    const task = taskItem.Item;

    const membersItems = await getMembers(userId, task.taskPanelId);
    console.log('membersItems', JSON.stringify(membersItems));
    if (!membersItems || !membersItems.Items || !membersItems.Items.length || membersItems.Items[0].mute) {
      return null;
    }
    const members = membersItems.Items;

    const subtasksItems = await getSubtasks(task.id);
    console.log('subtasksItems', JSON.stringify(subtasksItems));
    const subtasks = subtasksItems.Items;

    const userMessage = await sendUserMessage(userId, task, subtasks, when, description);
    console.log('userMessage', JSON.stringify(userMessage));
    return;
};
