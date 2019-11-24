/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUsersAreContacts = `query ListUsersAreContacts($contacts: [String]) {
  listUsersAreContacts(contacts: $contacts) {
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
export const getCurrentUser = `query GetCurrentUser {
  getCurrentUser {
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
export const getTask = `query GetTask($id: ID!) {
  getTask(id: $id) {
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
    until
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
      until
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
    nextToken
  }
}
`;
export const listSubtasksForTask = `query ListSubtasksForTask(
  $subtaskTaskId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelSubtaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listSubtasksForTask(
    subtaskTaskId: $subtaskTaskId
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
  $sortDirection: ModelSortDirection
  $filter: ModelTimeNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listTimeNotificationsForTask(
    timeNotificationTaskId: $timeNotificationTaskId
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
      until
      timeNotificationTaskId
    }
    nextToken
  }
}
`;
export const listPlaceNotificationsForTask = `query ListPlaceNotificationsForTask(
  $placeNotificationTaskId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelPlaceNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlaceNotificationsForTask(
    placeNotificationTaskId: $placeNotificationTaskId
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
  $sortDirection: ModelSortDirection
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessagesForTask(
    messageTaskId: $messageTaskId
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
      name
      imgKey
      members {
        items {
          id
          offline
          version
          memberPanelId
          memberUserId
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
            members {
              items {
                id
                offline
                version
                memberPanelId
                memberUserId
                createdAt
                updatedAt
                isOwner
                canAccess
                block
                mute
                pin
              }
              nextToken
            }
          }
        }
        nextToken
      }
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
    name
    imgKey
    members {
      items {
        id
        offline
        version
        memberPanelId
        memberUserId
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
          members {
            items {
              id
              offline
              version
              memberPanelId
              memberUserId
              createdAt
              updatedAt
              isOwner
              canAccess
              block
              mute
              pin
            }
            nextToken
          }
        }
      }
      nextToken
    }
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
      members {
        items {
          id
          offline
          version
          memberPanelId
          memberUserId
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
            members {
              nextToken
            }
          }
        }
        nextToken
      }
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
        members {
          items {
            id
            offline
            version
            memberPanelId
            memberUserId
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
              members {
                nextToken
              }
            }
          }
          nextToken
        }
      }
    }
    nextToken
  }
}
`;
export const listMembersForPanel = `query ListMembersForPanel(
  $memberPanelId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listMembersForPanel(
    memberPanelId: $memberPanelId
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
        members {
          items {
            id
            offline
            version
            memberPanelId
            memberUserId
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
              members {
                nextToken
              }
            }
          }
          nextToken
        }
      }
    }
    nextToken
  }
}
`;
export const listMembersForUser = `query ListMembersForUser(
  $memberUserId: ID
  $sortDirection: ModelSortDirection
  $filter: ModelMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listMembersForUser(
    memberUserId: $memberUserId
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
        members {
          items {
            id
            offline
            version
            memberPanelId
            memberUserId
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
              members {
                nextToken
              }
            }
          }
          nextToken
        }
      }
    }
    nextToken
  }
}
`;
