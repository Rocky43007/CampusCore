import { Platform, Linking } from 'react-native';

import { AppLink, WebLink } from '../types';

/**
 * Opens an app or its store page based on platform
 */
export const openAppLink = (appLinks: AppLink): void => {
  const appStoreLink: string = Platform.OS === 'ios' ? appLinks.ios : appLinks.android;
  let webLink: string;

  if (typeof appLinks.web === 'string') {
    webLink = appLinks.web;
  } else {
    webLink =
      Platform.OS === 'ios' ? (appLinks.web as WebLink).ios : (appLinks.web as WebLink).android;
  }

  Linking.canOpenURL(appStoreLink)
    .then((supported: boolean) => {
      if (supported) {
        return Linking.openURL(appStoreLink);
      } else {
        return Linking.openURL(webLink);
      }
    })
    .catch((err: Error) => {
      console.error('Error opening app link:', err);
      // Fallback to browser link if specified and app/store link fails
      if (typeof appLinks.web !== 'string' && (appLinks.web as WebLink).browser) {
        Linking.openURL((appLinks.web as WebLink).browser!);
      } else {
        Linking.openURL(webLink); // Fallback to general web link
      }
    });
};
