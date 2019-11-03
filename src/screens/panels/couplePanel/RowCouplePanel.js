import React from 'react';

import { withContacts } from '../../../contexts';

import { find } from 'lodash';

import { getUserName } from '../../../util';

import _RowPanel from '../_RowPanel';

class RowCouplePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, contacts } = this.props;
    const couple = find(member.panel.members.items, couple => couple.memberUserId != member.memberUserId);

    if (!couple) {
      return null;
    }

    return (
      <_RowPanel {...this.props} name={getUserName(couple.user, contacts)} imgKey={couple.user.imgKey} />
    )
  }
};

export default withContacts(RowCouplePanel);
