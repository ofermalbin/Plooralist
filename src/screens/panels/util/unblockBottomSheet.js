import React from 'react';

import BottomSheet from 'react-native-bottomsheet';

const unblockBottomSheet = (onUnblockPress) => BottomSheet.showBottomSheetWithOptions(
  {
    options: ['Unblock', 'Cancel'],
    title: 'Unblock',
    dark: true,
    cancelButtonIndex: 1,
  }, (index) => {
    if (index == 0) {
      onUnblockPress();
    }
  }
);

export default unblockBottomSheet;
