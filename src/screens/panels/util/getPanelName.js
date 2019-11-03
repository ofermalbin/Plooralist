import { differenceBy } from 'lodash';

import { getCurrentUserName, getUserName } from '../../../util';

export const getSinglePanelName = () => {
  return getCurrentUserName();
}

export const getCouplePanelName = (member, contacts) => {
  const membersExcludeMe = differenceBy(member.panel.members.items, [{memberUserId: member.memberUserId}], 'memberUserId');
  if (membersExcludeMe.length) {
    return getUserName(membersExcludeMe[0].user, contacts);
  }
  return null;
}

export const getTeamPanelName = (member) => {
  return member.panel.name;
}
