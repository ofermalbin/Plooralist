export const isMemberOwner = (member) => {
  if (!member) {
    return null;
  }
  return member.owner;
}

export const isMemberManager = (member) => {
  if (!member) {
    return null;
  }
  return member.manager;
}

export const isMemberBlock = (member) => {
  if (!member) {
    return null;
  }
  return member.block;
}

export const isMemberMute = (member) => {
  if (!member) {
    return null;
  }
  return member.mute;
}

export const isMemberPin = (member) => {
  if (!member) {
    return null;
  }
  return member.pin;
}
