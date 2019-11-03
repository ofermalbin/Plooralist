import React from 'react';

import RowSinglePanel from './singlePanel/RowSinglePanel';
import RowCouplePanel from './couplePanel/RowCouplePanel';
import RowTeamPanel from './teamPanel/RowTeamPanel';

class RowPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member } = this.props;
    if (!member || !member.panel) return null;

    let row;

    switch(member.panel.type) {
      case 1:
          row = <RowSinglePanel {...this.props} />
        break;
      case 2:
          row = <RowCouplePanel {...this.props} />
        break;
      case 3:
          row = <RowTeamPanel {...this.props} />
        break;
      default:
        return null;
    }
    return (
      row
    );
  }
}

export default RowPanel;
