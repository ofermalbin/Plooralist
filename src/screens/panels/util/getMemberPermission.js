export const isPanelOwner = (member) => {
  if (!member) {
    return null;
  }
  return member.isOwner;
}

export const canAccessPanel = (member) => {
  if (!member) {
    return null;
  }
  return member.canAccess;
}

export const isPanelBlock = (member) => {
  if (!member) {
    return null;
  }
  return member.block;
}

export const isPanelMute = (member) => {
  if (!member) {
    return null;
  }
  return member.mute;
}

export const isPanelPin = (member) => {
  if (!member) {
    return null;
  }
  return member.pin;
}
