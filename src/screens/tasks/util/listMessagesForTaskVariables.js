const maxDate = new Date(8640000000000000);
const maxDateISOString = maxDate.toISOString().substring(1);
const listMessagesForTaskVariables = messageTaskId => ({messageTaskId: messageTaskId, updatedAt: {lt: maxDateISOString}, sortDirection: 'DESC', limit: 1000});

export default listMessagesForTaskVariables;
