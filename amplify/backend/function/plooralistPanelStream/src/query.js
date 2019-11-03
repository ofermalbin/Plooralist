module.exports = {
    updateStreamMember: `mutation updateStreamMember($input: StreamMemberInput!) {
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
  `
}
