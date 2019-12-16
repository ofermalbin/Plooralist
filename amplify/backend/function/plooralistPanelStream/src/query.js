module.exports = {
    updateStreamMember: `mutation updateStreamMember($input: StreamMemberInput!) {
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
          name
          imgKey
        }
      }
    }
  `
}
