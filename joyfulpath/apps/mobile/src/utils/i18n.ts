import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

export const setRTL = async (isRTL: boolean) => {
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    await Updates.reloadAsync();
  }
};
