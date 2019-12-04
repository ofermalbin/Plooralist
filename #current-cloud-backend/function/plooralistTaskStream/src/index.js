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
const SubtaskTable = `Subtask-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const TimeNotificationTable = `TimeNotification-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const PlaceNotificationTable = `PlaceNotification-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;
const MessageTable = `Message-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;

const
    _ = require('lodash'),
    RRule = require('rrule'),
    AWS = require('aws-sdk'),
    ddb = new AWS.DynamoDB.DocumentClient(),
    pinpoint = new AWS.Pinpoint({region: analyticsPlooralistPinpointRegion});

const defaultParamsMessage = {
    Action: 'OPEN_APP',
    SilentPush: false,
    Sound: "sncfjingle"
};

exports.handler = async (event, context) => {

    const now = new Date();

    let insertItems = [];
    let modifyItems = [];
    let removeItems = [];
    let completedItems = [];
    let uncompletedItems = [];

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
          const newCompleted = record.new.completed;
          const oldCompleted = record.old.completed;
          modifyItems.push({...record.new, oldCompleted});
          if(newCompleted != oldCompleted) {
              newCompleted ? completedItems.push(record.new) : uncompletedItems.push(record.new);
          }
      }
      else if (record.eventName == 'REMOVE') {
          removeItems.push(record.old);
      }
    });

    const items = _.uniqBy(_.concat(insertItems, modifyItems, removeItems), 'taskPanelId');

    const scanMembersPromises = items.map(item => {

        const params = {
          TableName : MemberTable,
          FilterExpression : 'memberPanelId = :memberPanelId' ,
          ExpressionAttributeValues : {':memberPanelId' : item.taskPanelId}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanMembersAllData = await Promise.all(scanMembersPromises);

    const membersGroupByPanelId = _.groupBy(_.flattenDeep(_.filter(scanMembersAllData, data => data.Items.length).map(data => data.Items)), 'memberPanelId');

    const creaateTaskNotificationsMessages = _.filter(insertItems, item => membersGroupByPanelId[item.taskPanelId]).map(task => {
        const createMessage = {
            ...defaultParamsMessage,
            Title: task.name,
            Body: 'Create a new task',
            Data: {
                objType: 'task',
                objId: task.id
            }
        };
        let users = {};
        const membersAreMute = (task.membersAreMute && task.membersAreMute.values) ? task.membersAreMute.values : null;
        _.each(membersGroupByPanelId[task.taskPanelId], member => ((member.memberUserId != task.updatedBy) && !member.block && !member.mute && (!membersAreMute || !membersAreMute.length || (_.indexOf(membersAreMute, member.memberUserId) === -1))) ? users[member.memberUserId]={} : null);
        if(_.isEmpty(users)) {
            return null;
        }
       return {
            ApplicationId: analyticsPlooralistPinpointId,
            SendUsersMessageRequest: {
                Users: users,
                MessageConfiguration: {
                    APNSMessage: createMessage,
                    GCMMessage: createMessage
                }
            }
        };
    });

    const updateTaskNotificationsMessages = _.filter(modifyItems, item => (membersGroupByPanelId[item.taskPanelId] && (item.oldCompleted != item.completed))).map(task => {
        const updateMessage = {
            ...defaultParamsMessage,
            Title: task.name,
            Body: task.completed ? 'Task completed' : 'Task uncompleted',
            Data: {
                objType: 'task',
                objId: task.id
            }
        };
        let users = {};
        const membersAreMute = (task.membersAreMute && task.membersAreMute.values) ? task.membersAreMute.values : null;
        _.each(membersGroupByPanelId[task.taskPanelId], member => ((member.memberUserId != task.updatedBy) && !member.block && !member.mute && (!membersAreMute || !membersAreMute.length || (_.indexOf(membersAreMute, member.memberUserId) === -1))) ? users[member.memberUserId]={} : null);
        if(_.isEmpty(users)) {
            return null;
        }
        return {
            ApplicationId: analyticsPlooralistPinpointId,
            SendUsersMessageRequest: {
                Users: users,
                MessageConfiguration: {
                    APNSMessage: updateMessage,
                    GCMMessage: updateMessage
                }
            }
        };
    });

    console.log('updateTaskNotificationsMessages: ', JSON.stringify(updateTaskNotificationsMessages));

    const deleteTaskNotificationsMessages = _.filter(removeItems, item => membersGroupByPanelId[item.taskPanelId]).map(task => {
        const deleteMessage = {
            ...defaultParamsMessage,
            Title: task.name,
            Body: 'Task deleted',
            Data: {
                objType: 'task',
                objId: task.id
            }
        };
        let users = {};
        const membersAreMute = (task.membersAreMute && task.membersAreMute.values) ? task.membersAreMute.values : null;
        _.each(membersGroupByPanelId[task.taskPanelId], member => ((member.memberUserId != task.updatedBy) && !member.block && !member.mute && (!membersAreMute || !membersAreMute.length || (_.indexOf(membersAreMute, member.memberUserId) === -1))) ? users[member.memberUserId]={} : null);
        if(_.isEmpty(users)) {
            return null;
        }
        return {
            ApplicationId: analyticsPlooralistPinpointId,
            SendUsersMessageRequest: {
                Users: users,
                MessageConfiguration: {
                    APNSMessage: deleteMessage,
                    GCMMessage: deleteMessage
                }
            }
        };
    });

    const taskNotificationsMessages = _.compact(_.concat(creaateTaskNotificationsMessages, updateTaskNotificationsMessages, deleteTaskNotificationsMessages));

    const sendTaskNotificationsPromises = taskNotificationsMessages.map(message => {
        try {
            const data = pinpoint.sendUsersMessages(message).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const sendTaskNotificationsAllData = await Promise.all(sendTaskNotificationsPromises);

    console.log('sendTaskNotificationsAllData', JSON.stringify(sendTaskNotificationsAllData));

    const scanSubtasksDeletePromises = removeItems.map(item => {

        const params = {
          TableName : SubtaskTable,
          FilterExpression : 'subtaskTaskId = :subtaskTaskId' ,
          ExpressionAttributeValues : {':subtaskTaskId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanSubtasksDeleteAllData = await Promise.all(scanSubtasksDeletePromises);
    const subtasksDeleteItems = _.flattenDeep(_.filter(scanSubtasksDeleteAllData, data => data.Items.length).map(data => data.Items));

    const subtasksDeleteItemsChunks = _.chunk(subtasksDeleteItems, 25);

    const subtasksDeletePromises = subtasksDeleteItemsChunks.map(subtasksDeleteItemsChunk => {

        const DeleteRequests = subtasksDeleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [SubtaskTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const subtasksDeleteAllData = await Promise.all(subtasksDeletePromises);

    const subtasksDeleteUnprocessedItems = _.flatten(subtasksDeleteAllData.filter(subtasksDeleteData => subtasksDeleteData.UnprocessedItems && subtasksDeleteData.UnprocessedItems.DeleteRequest));
    const subtasksDeleteProcessedItems = _.pullAll(subtasksDeleteItems, subtasksDeleteUnprocessedItems);

    console.log('subtasksDeleteProcessedItems', JSON.stringify(subtasksDeleteProcessedItems));

    const scanMessagesDeletePromises = removeItems.map(item => {

        const params = {
          TableName : MessageTable,
          FilterExpression : 'messageTaskId = :messageTaskId' ,
          ExpressionAttributeValues : {':messageTaskId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanMessagesDeleteAllData = await Promise.all(scanMessagesDeletePromises);
    const messagesDeleteItems = _.flattenDeep(_.filter(scanMessagesDeleteAllData, data => data.Items.length).map(data => data.Items));

    const messagesDeleteItemsChunks = _.chunk(messagesDeleteItems, 25);

    const messagesDeletePromises = messagesDeleteItemsChunks.map(messagesDeleteItemsChunk => {

        const DeleteRequests = messagesDeleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [MessageTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const messagesDeleteAllData = await Promise.all(messagesDeletePromises);

    console.log('messagesDeleteAllData', JSON.stringify(messagesDeleteAllData));

    const messagesDeleteUnprocessedItems = _.flatten(messagesDeleteAllData.filter(messagesDeleteData => messagesDeleteData.UnprocessedItems && messagesDeleteData.UnprocessedItems.DeleteRequest));

    console.log('messagesDeleteUnprocessedItems', JSON.stringify(messagesDeleteUnprocessedItems));

    const messagesDeleteProcessedItems = _.pullAll(messagesDeleteItems, messagesDeleteUnprocessedItems);

    console.log('messagesDeleteProcessedItems', JSON.stringify(messagesDeleteProcessedItems));

    const scanTimeNotificationsDeletePromises = removeItems.map(item => {

        const params = {
          TableName : TimeNotificationTable,
          FilterExpression : 'timeNotificationTaskId = :timeNotificationTaskId' ,
          ExpressionAttributeValues : {':timeNotificationTaskId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanTimeNotificationsDeleteAllData = await Promise.all(scanTimeNotificationsDeletePromises);
    const timeNotificationsDeleteItems = _.flattenDeep(_.filter(scanTimeNotificationsDeleteAllData, data => data.Items.length).map(data => data.Items));

    const timeNotificationsDeleteItemsChunks = _.chunk(timeNotificationsDeleteItems, 25);

    const timeNotificationsDeletePromises = timeNotificationsDeleteItemsChunks.map(timeNotificationsDeleteItemsChunk => {

        const DeleteRequests = timeNotificationsDeleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [TimeNotificationTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const timeNotificationsDeleteAllData = await Promise.all(timeNotificationsDeletePromises);

    const timeNotificationsDeleteUnprocessedItems = _.flatten(timeNotificationsDeleteAllData.filter(timeNotificationsDeleteData => timeNotificationsDeleteData.UnprocessedItems && timeNotificationsDeleteData.UnprocessedItems.DeleteRequest));
    const timeNotificationsDeleteProcessedItems = _.pullAll(timeNotificationsDeleteItems, timeNotificationsDeleteUnprocessedItems);

    console.log('timeNotificationsDeleteProcessedItems', JSON.stringify(timeNotificationsDeleteProcessedItems));

    const scanPlaceNotificationsDeletePromises = removeItems.map(item => {

        const params = {
          TableName : PlaceNotificationTable,
          FilterExpression : 'placeNotificationTaskId = :placeNotificationTaskId' ,
          ExpressionAttributeValues : {':placeNotificationTaskId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanPlaceNotificationsDeleteAllData = await Promise.all(scanPlaceNotificationsDeletePromises);
    const placeNotificationsDeleteItems = _.flattenDeep(_.filter(scanPlaceNotificationsDeleteAllData, data => data.Items.length).map(data => data.Items));

    const placeNotificationsDeleteItemsChunks = _.chunk(placeNotificationsDeleteItems, 25);

    const placeNotificationsDeletePromises = placeNotificationsDeleteItemsChunks.map(placeNotificationsDeleteItemsChunk => {

        const DeleteRequests = placeNotificationsDeleteItemsChunk.map(deleteItem => {
            return {
                DeleteRequest: {
                    Key:  { id: deleteItem.id }
                }
            };
        });

        const requestItems = {
            RequestItems: {
                [PlaceNotificationTable]: DeleteRequests,
            }
        };

        try {
            const data = ddb.batchWrite(requestItems).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const placeNotificationsDeleteAllData = await Promise.all(placeNotificationsDeletePromises);

    const placeNotificationsDeleteUnprocessedItems = _.flatten(placeNotificationsDeleteAllData.filter(placeNotificationsDeleteData => placeNotificationsDeleteData.UnprocessedItems && placeNotificationsDeleteData.UnprocessedItems.DeleteRequest));
    const placeNotificationsDeleteProcessedItems = _.pullAll(placeNotificationsDeleteItems, placeNotificationsDeleteUnprocessedItems);

    console.log('placeNotificationsDeleteProcessedItems', JSON.stringify(placeNotificationsDeleteProcessedItems));

    //completedItems
    console.log('completedItems', JSON.stringify(completedItems));
    const scanCompletedTimeNotificationsPromises = completedItems.map(task => {

        const params = {
          TableName : TimeNotificationTable,
          FilterExpression : 'timeNotificationTaskId = :timeNotificationTaskId' ,
          ExpressionAttributeValues : {':timeNotificationTaskId' : task.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanCompletedTimeNotificationsAllData = await Promise.all(scanCompletedTimeNotificationsPromises);

    console.log('scanCompletedTimeNotificationsAllData', JSON.stringify(scanCompletedTimeNotificationsAllData));

    const completedTimeNotificationsItems = _.flattenDeep(_.filter(scanCompletedTimeNotificationsAllData, data => data.Items.length).map(data => data.Items));

    console.log('completedTimeNotificationsItems', JSON.stringify(completedTimeNotificationsItems));

    const updateCompletedTimeNotificationsPromises = completedTimeNotificationsItems.map(item => {

        const params = {
            TableName: TimeNotificationTable,
            Key: { id : item.id },
            UpdateExpression: 'set nextSend = :nextSend',
            ExpressionAttributeValues: {
                ':nextSend' : null
            }
        };

        try {
            const data = ddb.update(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const updateCompletedTimeNotificationsAllData = await Promise.all(updateCompletedTimeNotificationsPromises);

    console.log('updateCompletedTimeNotificationsAllData', JSON.stringify(updateCompletedTimeNotificationsAllData));

    //uncompletedItems
    console.log('uncompletedItems', JSON.stringify(uncompletedItems));
    const scanUncompletedTimeNotificationsPromises = uncompletedItems.map(task => {

        const params = {
          TableName : TimeNotificationTable,
          FilterExpression : 'timeNotificationTaskId = :timeNotificationTaskId' ,
          ExpressionAttributeValues : {':timeNotificationTaskId' : task.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const scanUncompletedTimeNotificationsAllData = await Promise.all(scanUncompletedTimeNotificationsPromises);

    console.log('scanUncompletedTimeNotificationsAllData', JSON.stringify(scanUncompletedTimeNotificationsAllData));

    const uncompletedTimeNotificationsItems = _.flattenDeep(_.filter(scanUncompletedTimeNotificationsAllData, data => data.Items.length).map(data => data.Items));

    console.log('uncompletedTimeNotificationsItems', JSON.stringify(uncompletedTimeNotificationsItems));

    const updateUncompletedTimeNotificationsPromises = uncompletedTimeNotificationsItems.map(item => {

        const { dtstart, freq, interval, byweekday, bymonth, count, until } = item;
        const rrule = new RRule.RRule({ dtstart: new Date(dtstart), freq, interval, byweekday, bymonth, count, until });
        const nextSend = rrule.after(now, true);

        const params = {
            TableName: TimeNotificationTable,
            Key: { id : item.id },
            UpdateExpression: 'set nextSend = :nextSend',
            ExpressionAttributeValues: {
                ':nextSend' : nextSend ? nextSend.toISOString() : null
            }
        };

        try {
            const data = ddb.update(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const updateUncompletedTimeNotificationsAllData = await Promise.all(updateUncompletedTimeNotificationsPromises);

    const updatePanelsPromises = items.map(item => {

        const params = {
            TableName : PanelTable,
            Key: { id : item.taskPanelId },
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
