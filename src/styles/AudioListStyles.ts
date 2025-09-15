import { StyleSheet } from 'react-native';

import { colors } from '../const/Colors';

export default StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  empty: { color: colors.black, fontSize: 17 },
  listContainer: { paddingHorizontal: 12, marginTop: 12 },
});
