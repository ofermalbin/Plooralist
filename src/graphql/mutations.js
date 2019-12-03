/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPanelAndMembers = `mutation CreatePanelAndMembers(
  $type: Int!
  $name: String
  $imgKey: String
  $ownersIds: [ID!]!
  $canAccessIds: [ID!]
  $membersIds: [ID!]
) {
  createPanelAndMembers(
    type: $type
    name: $name
    imgKey: $imgKey
    ownersIds: $ownersIds
    canAccessIds: $canAccessIds
    membersIds: $membersIds
  ) {
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
export const createStreamMember = `mutation CreateStreamMember($input: StreamMemberInput!) {
  createStreamMember(input: $input) {
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
export const updateStreamMember = `mutation UpdateStreamMember($input: StreamMemberInput!) {
  updateStreamMember(input: $input) {
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
export const deleteStreamMember = `mutation DeleteStreamMember($input: StreamMemberInput!) {
  deleteStreamMember(input: $input) {
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
export const createUser = `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
`;
export const updateUser = `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
`;
export const deleteUser = `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
`;
export const createPanel = `mutation CreatePanel(
  $input: CreatePanelInput!
  $condition: ModelPanelConditionInput
) {
  createPanel(input: $input, condition: $condition) {
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
export const updatePanel = `mutation UpdatePanel(
  $input: UpdatePanelInput!
  $condition: ModelPanelConditionInput
) {
  updatePanel(input: $input, condition: $condition) {
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
export const deletePanel = `mutation DeletePanel(
  $input: DeletePanelInput!
  $condition: ModelPanelConditionInput
) {
  deletePanel(input: $input, condition: $condition) {
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
export const createMember = `mutation CreateMember(
  $input: CreateMemberInput!
  $condition: ModelMemberConditionInput
) {
  createMember(input: $input, condition: $condition) {
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
export const updateMember = `mutation UpdateMember(
  $input: UpdateMemberInput!
  $condition: ModelMemberConditionInput
) {
  updateMember(input: $input, condition: $condition) {
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
export const deleteMember = `mutation DeleteMember(
  $input: DeleteMemberInput!
  $condition: ModelMemberConditionInput
) {
  deleteMember(input: $input, condition: $condition) {
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
export const createTask = `mutation CreateTask(
  $input: CreateTaskInput!
  $condition: ModelTaskConditionInput
) {
  createTask(input: $input, condition: $condition) {
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
export const updateTask = `mutation UpdateTask(
  $input: UpdateTaskInput!
  $condition: ModelTaskConditionInput
) {
  updateTask(input: $input, condition: $condition) {
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
export const deleteTask = `mutation DeleteTask(
  $input: DeleteTaskInput!
  $condition: ModelTaskConditionInput
) {
  deleteTask(input: $input, condition: $condition) {
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
export const createSubtask = `mutation CreateSubtask(
  $input: CreateSubtaskInput!
  $condition: ModelSubtaskConditionInput
) {
  createSubtask(input: $input, condition: $condition) {
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
export const updateSubtask = `mutation UpdateSubtask(
  $input: UpdateSubtaskInput!
  $condition: ModelSubtaskConditionInput
) {
  updateSubtask(input: $input, condition: $condition) {
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
export const deleteSubtask = `mutation DeleteSubtask(
  $input: DeleteSubtaskInput!
  $condition: ModelSubtaskConditionInput
) {
  deleteSubtask(input: $input, condition: $condition) {
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
export const createTimeNotification = `mutation CreateTimeNotification(
  $input: CreateTimeNotificationInput!
  $condition: ModelTimeNotificationConditionInput
) {
  createTimeNotification(input: $input, condition: $condition) {
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
export const updateTimeNotification = `mutation UpdateTimeNotification(
  $input: UpdateTimeNotificationInput!
  $condition: ModelTimeNotificationConditionInput
) {
  updateTimeNotification(input: $input, condition: $condition) {
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
export const deleteTimeNotification = `mutation DeleteTimeNotification(
  $input: DeleteTimeNotificationInput!
  $condition: ModelTimeNotificationConditionInput
) {
  deleteTimeNotification(input: $input, condition: $condition) {
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
export const createPlaceNotification = `mutation CreatePlaceNotification(
  $input: CreatePlaceNotificationInput!
  $condition: ModelPlaceNotificationConditionInput
) {
  createPlaceNotification(input: $input, condition: $condition) {
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
export const updatePlaceNotification = `mutation UpdatePlaceNotification(
  $input: UpdatePlaceNotificationInput!
  $condition: ModelPlaceNotificationConditionInput
) {
  updatePlaceNotification(input: $input, condition: $condition) {
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
export const deletePlaceNotification = `mutation DeletePlaceNotification(
  $input: DeletePlaceNotificationInput!
  $condition: ModelPlaceNotificationConditionInput
) {
  deletePlaceNotification(input: $input, condition: $condition) {
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
export const createMessage = `mutation CreateMessage(
  $input: CreateMessageInput!
  $condition: ModelMessageConditionInput
) {
  createMessage(input: $input, condition: $condition) {
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
export const updateMessage = `mutation UpdateMessage(
  $input: UpdateMessageInput!
  $condition: ModelMessageConditionInput
) {
  updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = `mutation DeleteMessage(
  $input: DeleteMessageInput!
  $condition: ModelMessageConditionInput
) {
  deleteMessage(input: $input, condition: $condition) {
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
