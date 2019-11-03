import React from 'react';

import { TextNameUser } from '../../users'

class TextMemberName extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member } = this.props;
    return (
      <TextNameUser style={this.props.style} user={member.user} />
    )
  }
};

export default TextMemberName;
