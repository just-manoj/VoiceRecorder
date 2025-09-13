import { StyleSheet } from 'react-native';
import { colors } from '../const/Colors';

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.carbon,
  },
  duration: {
    fontSize: 12,
    color: colors.cursedGrey,
    marginTop: 3,
  },
  playButton: {
    marginLeft: 10,
  },
});
