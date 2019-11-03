import React from 'react';

import { ListItem } from 'react-native-elements';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import _ from 'lodash';

import { withContacts } from '../../../contexts';

import colors from '../../../config/colors';

import { AvatarS3Image } from '../../../components';

import { getUserName } from '../../../util';

import { listStyles } from '../config/stylesheets';

class RowPotentialUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
    })
  }

  onCheckeBoxPress() {
    this.props.onPotentialUserChecked(this.props.user, !this.state.checked);
    //this.setState({checked: !this.state.checked});
  }

  onPress() {
    this.props.onPress && this.props.onPress(this.props.user.id);
  }

  render() {
    const {user, contacts} = this.props;
    const name = getUserName(user, contacts);
    return (
      <ListItem
        containerStyle={listStyles.container}
        titleStyle={listStyles.title}
        title={name}
        leftAvatar={
          <AvatarS3Image
            imgKey={user.imgKey}
            name={name}
            containerStyle={listStyles.avatarContainer}
            rounded={true}
          />
        }
        checkBox={{
          size: listStyles.checkboxContainer.width,
          checked: this.state.checked,
          checkedColor: colors.checkedIcon,
          uncheckedColor: colors.uncheckedIcon,
          onPress: this.onCheckeBoxPress.bind(this)
        }}/>
    )
  }
};

export default withContacts(RowPotentialUser);
