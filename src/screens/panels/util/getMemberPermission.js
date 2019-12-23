export const isPanelManager = (member) => {
  if (!member) {
    return null;
  }
  return member.manager;
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
