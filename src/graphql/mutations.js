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
export const createStreamMember = `mutation CreateStreamMember($input: StreamMemberInput!) {
  createStreamMember(input: $input) {
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
export const updateStreamMember = `mutation UpdateStreamMember($input: StreamMemberInput!) {
  updateStreamMember(input: $input) {
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
export const deleteStreamMember = `mutation DeleteStreamMember($input: StreamMemberInput!) {
  deleteStreamMember(input: $input) {
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
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createPanel = `mutation CreatePanel($input: CreatePanelInput!) {
  createPanel(input: $input) {
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
export const updatePanel = `mutation UpdatePanel($input: UpdatePanelInput!) {
  updatePanel(input: $input) {
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
export const deletePanel = `mutation DeletePanel($input: DeletePanelInput!) {
  deletePanel(input: $input) {
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
export const createMember = `mutation CreateMember($input: CreateMemberInput!) {
  createMember(input: $input) {
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
export const updateMember = `mutation UpdateMember($input: UpdateMemberInput!) {
  updateMember(input: $input) {
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
export const deleteMember = `mutation DeleteMember($input: DeleteMemberInput!) {
  deleteMember(input: $input) {
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
export const createTask = `mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
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
export const updateTask = `mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
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
export const deleteTask = `mutation DeleteTask($input: DeleteTaskInput!) {
  deleteTask(input: $input) {
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
export const createSubtask = `mutation CreateSubtask($input: CreateSubtaskInput!) {
  createSubtask(input: $input) {
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
export const updateSubtask = `mutation UpdateSubtask($input: UpdateSubtaskInput!) {
  updateSubtask(input: $input) {
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
export const deleteSubtask = `mutation DeleteSubtask($input: DeleteSubtaskInput!) {
  deleteSubtask(input: $input) {
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
export const createTimeNotification = `mutation CreateTimeNotification($input: CreateTimeNotificationInput!) {
  createTimeNotification(input: $input) {
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
export const updateTimeNotification = `mutation UpdateTimeNotification($input: UpdateTimeNotificationInput!) {
  updateTimeNotification(input: $input) {
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
export const deleteTimeNotification = `mutation DeleteTimeNotification($input: DeleteTimeNotificationInput!) {
  deleteTimeNotification(input: $input) {
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
export const createPlaceNotification = `mutation CreatePlaceNotification($input: CreatePlaceNotificationInput!) {
  createPlaceNotification(input: $input) {
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
export const updatePlaceNotification = `mutation UpdatePlaceNotification($input: UpdatePlaceNotificationInput!) {
  updatePlaceNotification(input: $input) {
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
export const deletePlaceNotification = `mutation DeletePlaceNotification($input: DeletePlaceNotificationInput!) {
  deletePlaceNotification(input: $input) {
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
export const createMessage = `mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
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
export const updateMessage = `mutation UpdateMessage($input: UpdateMessageInput!) {
  updateMessage(input: $input) {
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
export const deleteMessage = `mutation DeleteMessage($input: DeleteMessageInput!) {
  deleteMessage(input: $input) {
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
