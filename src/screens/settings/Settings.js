import React from 'react';

import { CurrentUserInfo } from '../currentUser';

class Settings extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <CurrentUserInfo {...this.props} />
    )
  }
};

export default Settings;
