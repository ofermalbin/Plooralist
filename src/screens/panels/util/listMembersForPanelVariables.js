const maxDate = new Date(8640000000000000);
const maxDateISOString = maxDate.toISOString().substring(1);
const listMembersForPanelVariables = memberPanelId => ({memberPanelId: memberPanelId, updatedAt: {lt: maxDateISOString}, sortDirection: 'DESC', limit: 1000});

export default listMembersForPanelVariables;
