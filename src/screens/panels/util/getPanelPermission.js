export const isOnlyManagersCreateTask = (panel) => {
  if (!panel) {
    return null;
  }
  return panel.onlyManagersCreateTask;
}

export const isOnlyManagersEditInfo = (panel) => {
  if (!panel) {
    return null;
  }
  return panel.onlyManagersEditInfo;
}

export const isOnlyManagersEditMembers = (panel) => {
  if (!panel) {
    return null;
  }
  return panel.onlyManagersEditMembers;
}
