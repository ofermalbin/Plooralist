import React from 'react';

import { withCurrentUser } from '../../../contexts';

import _RowPanel from '../_RowPanel';

class RowSinglePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, currentUser } = this.props;
    
    return (
      <_RowPanel {...this.props} name={'Me'} imgKey={currentUser.imgKey} />
    )
  }
};

export default withCurrentUser(RowSinglePanel);
