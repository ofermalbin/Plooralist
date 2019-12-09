const maxDate = new Date(8640000000000000);
const maxDateISOString = maxDate.toISOString().substring(1);
const listMembersForUserVariables = memberUserId => ({memberUserId: memberUserId, updatedAt: {lt: maxDateISOString}, sortDirection: 'DESC', limit: 1000});

export default listMembersForUserVariables;
