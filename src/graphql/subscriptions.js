/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStreamMember = `subscription OnCreateStreamMember($memberUserId: String!) {
  onCreateStreamMember(memberUserId: $memberUserId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onUpdateStreamMember = `subscription OnUpdateStreamMember($memberUserId: String!) {
  onUpdateStreamMember(memberUserId: $memberUserId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onDeleteStreamMember = `subscription OnDeleteStreamMember($memberUserId: String!) {
  onDeleteStreamMember(memberUserId: $memberUserId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onCreateMember = `subscription OnCreateMember($memberPanelId: String!) {
  onCreateMember(memberPanelId: $memberPanelId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onUpdateMember = `subscription OnUpdateMember($memberPanelId: String!) {
  onUpdateMember(memberPanelId: $memberPanelId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onDeleteMember = `subscription OnDeleteMember($memberPanelId: String!) {
  onDeleteMember(memberPanelId: $memberPanelId) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    isOwner
    canAccess
    block
    mute
    pin
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    panel {
      id
      offline
      version
      createdAt
      updatedAt
      type
      name
      imgKey
    }
  }
}
`;
export const onUpdatePanel = `subscription OnUpdatePanel($id: String!) {
  onUpdatePanel(id: $id) {
    id
    offline
    version
    createdAt
    updatedAt
    type
    name
    imgKey
  }
}
`;
export const onDeletePanel = `subscription OnDeletePanel($id: String!) {
  onDeletePanel(id: $id) {
    id
    offline
    version
    createdAt
    updatedAt
    type
    name
    imgKey
  }
}
`;
export const onCreateTask = `subscription OnCreateTask($taskPanelId: String!) {
  onCreateTask(taskPanelId: $taskPanelId) {
    id
    offline
    version
    createdAt
    updatedAt
    updatedBy
    membersAreMute
    name
    description
    completed
    taskPanelId
    taskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onUpdateTask = `subscription OnUpdateTask($taskPanelId: String!) {
  onUpdateTask(taskPanelId: $taskPanelId) {
    id
    offline
    version
    createdAt
    updatedAt
    updatedBy
    membersAreMute
    name
    description
    completed
    taskPanelId
    taskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onDeleteTask = `subscription OnDeleteTask($taskPanelId: String!) {
  onDeleteTask(taskPanelId: $taskPanelId) {
    id
    offline
    version
    createdAt
    updatedAt
    updatedBy
    membersAreMute
    name
    description
    completed
    taskPanelId
    taskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onCreateSubtask = `subscription OnCreateSubtask($subtaskTaskId: String!) {
  onCreateSubtask(subtaskTaskId: $subtaskTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    name
    description
    completed
    subtaskTaskId
    subtaskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onUpdateSubtask = `subscription OnUpdateSubtask($subtaskTaskId: String!) {
  onUpdateSubtask(subtaskTaskId: $subtaskTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    name
    description
    completed
    subtaskTaskId
    subtaskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onDeleteSubtask = `subscription OnDeleteSubtask($subtaskTaskId: String!) {
  onDeleteSubtask(subtaskTaskId: $subtaskTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    name
    description
    completed
    subtaskTaskId
    subtaskUserId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onCreateTimeNotification = `subscription OnCreateTimeNotification($timeNotificationTaskId: String!) {
  onCreateTimeNotification(timeNotificationTaskId: $timeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    lastSend
    nextSend
    dtstart
    freq
    interval
    byweekday
    bymonth
    count
    timeNotificationTaskId
  }
}
`;
export const onUpdateTimeNotification = `subscription OnUpdateTimeNotification($timeNotificationTaskId: String!) {
  onUpdateTimeNotification(timeNotificationTaskId: $timeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    lastSend
    nextSend
    dtstart
    freq
    interval
    byweekday
    bymonth
    count
    timeNotificationTaskId
  }
}
`;
export const onDeleteTimeNotification = `subscription OnDeleteTimeNotification($timeNotificationTaskId: String!) {
  onDeleteTimeNotification(timeNotificationTaskId: $timeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    lastSend
    nextSend
    dtstart
    freq
    interval
    byweekday
    bymonth
    count
    timeNotificationTaskId
  }
}
`;
export const onCreatePlaceNotification = `subscription OnCreatePlaceNotification($placeNotificationTaskId: String!) {
  onCreatePlaceNotification(placeNotificationTaskId: $placeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    placeID
    name
    latitude
    longitude
    when
    radius
    placeNotificationTaskId
  }
}
`;
export const onUpdatePlaceNotification = `subscription OnUpdatePlaceNotification($placeNotificationTaskId: String!) {
  onUpdatePlaceNotification(placeNotificationTaskId: $placeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    placeID
    name
    latitude
    longitude
    when
    radius
    placeNotificationTaskId
  }
}
`;
export const onDeletePlaceNotification = `subscription OnDeletePlaceNotification($placeNotificationTaskId: String!) {
  onDeletePlaceNotification(placeNotificationTaskId: $placeNotificationTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    placeID
    name
    latitude
    longitude
    when
    radius
    placeNotificationTaskId
  }
}
`;
export const onCreateTaskMessage = `subscription OnCreateTaskMessage($messageTaskId: String!) {
  onCreateTaskMessage(messageTaskId: $messageTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    text
    imgKey
    place
    messageUserId
    messagePanelId
    messageTaskId
    messageSubtaskId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onUpdateTaskMessage = `subscription OnUpdateTaskMessage($messageTaskId: String!) {
  onUpdateTaskMessage(messageTaskId: $messageTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    text
    imgKey
    place
    messageUserId
    messagePanelId
    messageTaskId
    messageSubtaskId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
export const onDeleteTaskMessage = `subscription OnDeleteTaskMessage($messageTaskId: String!) {
  onDeleteTaskMessage(messageTaskId: $messageTaskId) {
    id
    offline
    version
    createdAt
    updatedAt
    text
    imgKey
    place
    messageUserId
    messagePanelId
    messageTaskId
    messageSubtaskId
    user {
      id
      offline
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
  }
}
`;
