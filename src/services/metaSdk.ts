import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';

let isMetaInitialized = false;
let hasLoggedActivate = false;

const FACEBOOK_APP_ID = '1597246918228724';
const FACEBOOK_APP_NAME = 'Volcano Coin Atlas Iceland';

export const initMetaSdk = () => {
  if (isMetaInitialized) return;

  try {
    Settings.setAppID(FACEBOOK_APP_ID);
    Settings.setAppName(FACEBOOK_APP_NAME);
    Settings.setAutoLogAppEventsEnabled(true);
    Settings.initializeSDK();

    isMetaInitialized = true;
    console.log('Meta SDK initialized');
  } catch (error) {
    console.log('Meta SDK init error:', error);
  }
};

export const logActivateApp = () => {
  if (hasLoggedActivate) return;
  hasLoggedActivate = true;

  try {
    AppEventsLogger.logEvent('fb_mobile_activate_app');
    console.log('Meta activate_app sent');
  } catch (error) {
    console.log('Meta activate_app error:', error);
  }
};

export const logTestEvent = () => {
  try {
    AppEventsLogger.logEvent('TestEventFromRN');
    console.log('Meta test event sent');
  } catch (error) {
    console.log('Meta test event error:', error);
  }
};

