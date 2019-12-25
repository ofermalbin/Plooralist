/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUsersAreContacts = `query ListUsersAreContacts($contacts: [String]) {
  listUsersAreContacts(contacts: $contacts) {
    id
    offline
    active
    identityId
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
export const createCouplPanelsFromUsersAreContacts = `query CreateCouplPanelsFromUsersAreContacts($usersIds: [ID!]) {
  createCouplPanelsFromUsersAreContacts(usersIds: $usersIds)
}
`;
export const getTask = `query GetTask($id: ID!) {
  getTask(id: $id) {
    id
    offline
    version
    createdAt
    updatedAt
    updatedBy
    name
    description
    completed
    taskPanelId
    taskUserId
    user {
      id
      offline
      active
      identityId
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
export const listTasks = `query ListTasks(
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      offline
      version
      createdAt
      updatedAt
      updatedBy
      name
      description
      completed
      taskPanelId
      taskUserId
      user {
        id
        offline
        active
        identityId
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
    nextToken
  }
}
`;
export const getSubtask = `query GetSubtask($id: ID!) {
  getSubtask(id: $id) {
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
      active
      identityId
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
export const listSubtasks = `query ListSubtasks(
  $filter: ModelSubtaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listSubtasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        active
        identityId
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
    nextToken
  }
}
`;
export const getTimeNotification = `query GetTimeNotification($id: ID!) {
  getTimeNotification(id: $id) {
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
export const listTimeNotifications = `query ListTimeNotifications(
  $filter: ModelTimeNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listTimeNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPlaceNotification = `query GetPlaceNotification($id: ID!) {
  getPlaceNotification(id: $id) {
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
export const listPlaceNotifications = `query ListPlaceNotifications(
  $filter: ModelPlaceNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlaceNotifications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const getMessage = `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
      active
      identityId
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
export const listMessages = `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        active
        identityId
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
    nextToken
  }
}
`;
export const listTasksForPanel = `query ListTasksForPanel(
  $taskPanelId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listTasksForPanel(
    taskPanelId: $taskPanelId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      offline
      version
      createdAt
      updatedAt
      updatedBy
      name
      description
      completed
      taskPanelId
      taskUserId
      user {
        id
        offline
        active
        identityId
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
    nextToken
  }
}
`;
export const listSubtasksForTask = `query ListSubtasksForTask(
  $subtaskTaskId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelSubtaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listSubtasksForTask(
    subtaskTaskId: $subtaskTaskId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
        active
        identityId
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
    nextToken
  }
}
`;
export const listTimeNotificationsForTask = `query ListTimeNotificationsForTask(
  $timeNotificationTaskId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTimeNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listTimeNotificationsForTask(
    timeNotificationTaskId: $timeNotificationTaskId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const listPlaceNotificationsForTask = `query ListPlaceNotificationsForTask(
  $placeNotificationTaskId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPlaceNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlaceNotificationsForTask(
    placeNotificationTaskId: $placeNotificationTaskId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const listMessagesForTask = `query ListMessagesForTask(
  $messageTaskId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessagesForTask(
    messageTaskId: $messageTaskId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
        active
        identityId
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
    nextToken
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      offline
      active
      identityId
      phoneNumber
      version
      createdAt
      updatedAt
      name
      email
      locale
      imgKey
    }
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    offline
    active
    identityId
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
export const listPanels = `query ListPanels(
  $filter: ModelPanelFilterInput
  $limit: Int
  $nextToken: String
) {
  listPanels(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      offline
      version
      createdAt
      updatedAt
      type
      onlyManagersCreateTask
      onlyManagersEditInfo
      onlyManagersEditMembers
      name
      imgKey
    }
    nextToken
  }
}
`;
export const getPanel = `query GetPanel($id: ID!) {
  getPanel(id: $id) {
    id
    offline
    version
    createdAt
    updatedAt
    type
    onlyManagersCreateTask
    onlyManagersEditInfo
    onlyManagersEditMembers
    name
    imgKey
  }
}
`;
export const getMember = `query GetMember($id: ID!) {
  getMember(id: $id) {
    id
    offline
    version
    memberPanelId
    memberUserId
    coupleUserId
    createdAt
    updatedAt
    owner
    manager
    block
    mute
    pin
    user {
      id
      offline
      active
      identityId
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
      onlyManagersCreateTask
      onlyManagersEditInfo
      onlyManagersEditMembers
      name
      imgKey
    }
  }
}
`;
export const listMembers = `query ListMembers(
  $filter: ModelMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      offline
      version
      memberPanelId
      memberUserId
      coupleUserId
      createdAt
      updatedAt
      owner
      manager
      block
      mute
      pin
      user {
        id
        offline
        active
        identityId
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
        onlyManagersCreateTask
        onlyManagersEditInfo
        onlyManagersEditMembers
        name
        imgKey
      }
    }
    nextToken
  }
}
`;
export const listMembersForPanel = `query ListMembersForPanel(
  $memberPanelId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listMembersForPanel(
    memberPanelId: $memberPanelId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      offline
      version
      memberPanelId
      memberUserId
      coupleUserId
      createdAt
      updatedAt
      owner
      manager
      block
      mute
      pin
      user {
        id
        offline
        active
        identityId
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
        onlyManagersCreateTask
        onlyManagersEditInfo
        onlyManagersEditMembers
        name
        imgKey
      }
    }
    nextToken
  }
}
`;
export const listMembersForUser = `query ListMembersForUser(
  $memberUserId: ID
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listMembersForUser(
    memberUserId: $memberUserId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      offline
      version
      memberPanelId
      memberUserId
      coupleUserId
      createdAt
      updatedAt
      owner
      manager
      block
      mute
      pin
      user {
        id
        offline
        active
        identityId
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
        onlyManagersCreateTask
        onlyManagersEditInfo
        onlyManagersEditMembers
        name
        imgKey
      }
    }
    nextToken
  }
}
`;
