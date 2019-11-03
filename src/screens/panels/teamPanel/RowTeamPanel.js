import React from 'react';

import _RowPanel from '../_RowPanel';

class RowTeamPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member } = this.props;

    return (
      <_RowPanel {...this.props} name={member.panel.name} imgKey={member.panel.imgKey} />
    )
  }
};

export default RowTeamPanel;
