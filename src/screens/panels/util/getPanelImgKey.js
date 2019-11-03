import { differenceBy } from 'lodash';

export const getSinglePanelImgKey = (user) => {
  return user.imgKey;
}

export const getCouplePanelImgKey = (member) => {
  const membersExcludeMe = differenceBy(member.panel.members.items, [{memberUserId: member.memberUserId}], 'memberUserId');
  if (membersExcludeMe.length) {
    return membersExcludeMe[0].user.imgKey;
  }
  return null;
}

export const getTeamPanelImgKey = (member) => {
  return member.panel.imgKey;
}
