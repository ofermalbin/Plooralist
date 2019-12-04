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
const TimeNotificationTable = `TimeNotification-${apiPlooralistGraphQLGraphQLAPIIdOutput}-${environment}`;

const
    _ = require('lodash'),
    RRule = require('rrule'),
    AWS = require('aws-sdk'),
    ddb = new AWS.DynamoDB.DocumentClient(),
    pinpoint = new AWS.Pinpoint();

const defaultParamsMessage = {
    Action: 'OPEN_APP',
    SilentPush: false,
    Sound: "sncfjingle"
};

exports.handler = async (event, context) => {

    const now = new Date();

    const scanTimeNotifications = () => {
        const params = {
          TableName : TimeNotificationTable,
          FilterExpression : 'nextSend < :nextSend',
          ExpressionAttributeValues : {':nextSend' : now.toISOString()}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    };

    const timeNotificationsData = await scanTimeNotifications();
    //console.log('timeNotificationsData', JSON.stringify(timeNotificationsData));

    const scanTasksPromises = timeNotificationsData.Items.map(item => {

        const params = {
          TableName : TaskTable,
          FilterExpression : 'id = :timeNotificationTaskId',
          ExpressionAttributeValues : {':timeNotificationTaskId' : item.timeNotificationTaskId}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const tasksPromisesAllData = await Promise.all(scanTasksPromises);
    //console.log('tasksPromisesAllData', JSON.stringify(tasksPromisesAllData));

    const tasks = _.uniqBy(_.flattenDeep(_.filter(tasksPromisesAllData, data => data.Items.length).map(data => data.Items)), 'id');
    //console.log('tasks', JSON.stringify(tasks));

    const scanSubtasksPromises = timeNotificationsData.Items.map(item => {

        const params = {
          TableName : SubtaskTable,
          FilterExpression : 'subtaskTaskId = :subtaskTaskId',
          ExpressionAttributeValues : {':subtaskTaskId' : item.timeNotificationTaskId}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const subtasksPromisesAllData = await Promise.all(scanSubtasksPromises);
    //console.log('subtasksPromisesAllData', JSON.stringify(subtasksPromisesAllData));

    const subtasksGroupByTaskId = _.groupBy(_.uniqBy(_.flattenDeep(_.filter(subtasksPromisesAllData, data => data.Items.length).map(data => data.Items)), 'id'), 'subtaskTaskId');

    const scanPanelsPromises = tasks.map(item => {

        const params = {
          TableName : PanelTable,
          FilterExpression : 'id = :taskPanelId',
          ExpressionAttributeValues : {':taskPanelId' : item.taskPanelId}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const panelsPromisesAllData = await Promise.all(scanPanelsPromises);
    //console.log('panelsPromisesAllData', JSON.stringify(panelsPromisesAllData));

    const panels = _.uniqBy(_.flattenDeep(_.filter(panelsPromisesAllData, data => data.Items.length).map(data => data.Items)), 'id');

    const scanMembersPromises = panels.map(item => {

        const params = {
          TableName : MemberTable,
          FilterExpression : 'memberPanelId = :memberPanelId',
          ExpressionAttributeValues : {':memberPanelId' : item.id}
        };

        try {
            const data = ddb.scan(params).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const membersPromisesAllData = await Promise.all(scanMembersPromises);
    //console.log('membersPromisesAllData', JSON.stringify(membersPromisesAllData));

    const membersGroupByPanelId = _.groupBy(_.flattenDeep(_.filter(membersPromisesAllData, data => data.Items.length).map(data => data.Items)), 'memberPanelId');
    //console.log('membersGroupByPanelId', JSON.stringify(membersGroupByPanelId));

    const taskNotificationsMessages = _.filter(tasks, item => membersGroupByPanelId[item.taskPanelId]).map(task => {
      
        const subtasksMessage = subtasksGroupByTaskId[task.id] ? _.join(subtasksGroupByTaskId[task.id].map(subtask => `${subtask.name}${subtask.completed ? ' ✔️' : ''}`), '\n') : null;

        const message = {
            ...defaultParamsMessage,
            Title: task.name,
            Body: `${(subtasksMessage && subtasksMessage.length) ? subtasksMessage : ''}`,
            Data: {
                objType: 'task',
                objId: task.id
            }
        };

        const membersAreMute = (task.membersAreMute && task.membersAreMute.values) ? task.membersAreMute.values : null;
        const users = {};

        _.each(membersGroupByPanelId[task.taskPanelId], member => (!member.block && !member.mute && (!membersAreMute || !membersAreMute.length || (_.indexOf(membersAreMute, member.memberUserId) === -1))) ? users[member.memberUserId]={} : null);

        if(_.isEmpty(users)) {
            console.log('users isEmpty');
            return null;
        }

        return {
            ApplicationId: analyticsPlooralistPinpointId,
            SendUsersMessageRequest: {
                Users: users,
                MessageConfiguration: {
                    APNSMessage: message,
                    GCMMessage: message
                }
            }
        };
    });

    const sendTaskNotificationsPromises = _.compact(taskNotificationsMessages).map(message => {
        try {
            const data = pinpoint.sendUsersMessages(message).promise();
            return data;
        } catch (error) {
            return error;
        }
    });

    const sendTaskNotificationsAllData = await Promise.all(sendTaskNotificationsPromises);
    console.log('sendTaskNotificationsAllData', JSON.stringify(sendTaskNotificationsAllData));

    const updateTimeNotificationsPromises = timeNotificationsData.Items.map(item => {

        const { dtstart, freq, interval, byweekday, bymonth, count, until } = item;
        const rrule = new RRule.RRule({ dtstart: new Date(dtstart), freq, interval, byweekday, bymonth, count, until });
        const nextSend = rrule.after(now, true);

        const params = {
          TableName: TimeNotificationTable,
          Key: { id : item.id },
          UpdateExpression: 'set lastSend = :lastSend, nextSend = :nextSend',
          ExpressionAttributeValues: {
            ':lastSend' : now.toISOString(),
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

    const updateTimeNotificationsAllData = await Promise.all(updateTimeNotificationsPromises);

    return;
};
