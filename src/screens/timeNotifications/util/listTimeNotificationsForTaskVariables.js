const maxDate = new Date(8640000000000000);
const maxDateISOString = maxDate.toISOString().substring(1);
const listTimeNotificationsForTaskVariables = timeNotificationTaskId => ({timeNotificationTaskId: timeNotificationTaskId, updatedAt: {lt: maxDateISOString}, sortDirection: 'DESC', limit: 1000});

export default listTimeNotificationsForTaskVariables;
