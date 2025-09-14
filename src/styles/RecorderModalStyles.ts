import { StyleSheet } from 'react-native';

import { colors } from '../const/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000051',
    paddingHorizontal: 20,
  },
  secondaryContainer: {
    flex: 0.3,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 10,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 100,
    elevation: 4,
  },
  duration: { color: colors.black, fontSize: 25 },
  controllerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 50,
  },
  icon: {
    padding: 10,
    borderRadius: 50,
  },
});
