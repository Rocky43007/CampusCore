import { AppLinks } from '../types';

export const APP_LINKS: AppLinks = {
  fitness: {
    ios: 'itms-apps://itunes.apple.com/us/app/sbu-recreation-and-wellness/id1534915719',
    android: 'market://details?id=com.innosoftfusiongo.stonybrookuniversity',
    web: {
      ios: 'https://apps.apple.com/us/app/sbu-recreation-and-wellness/id1534915719',
      android:
        'https://play.google.com/store/apps/details?id=com.innosoftfusiongo.stonybrookuniversity',
    },
  },
  printing: {
    ios: 'itms-apps://itunes.apple.com/us/app/pharos-print/id918145672',
    android: 'market://details?id=com.pharossystems.pharosprint',
    web: {
      ios: 'https://apps.apple.com/us/app/pharos-print/id918145672',
      android: 'https://play.google.com/store/apps/details?id=com.pharossystems.pharosprint',
      browser: 'https://print.stonybrook.edu',
    },
  },
  transport: {
    bus: {
      ios: 'itms-apps://itunes.apple.com/app/eta-spot/id1021211544',
      android: 'market://details?id=com.etatransit',
      web: 'https://stonybrook.edu/etaspot',
    },
    bike: {
      ios: 'itms-apps://itunes.apple.com/app/pbsc/id557237724',
      android: 'market://details?id=pbsc.bikes',
      web: {
        ios: 'https://apps.apple.com/ca/app/pbsc/id557237724',
        android: 'https://play.google.com/store/apps/details?id=pbsc.bikes',
      },
    },
  },
  dining: {
    get: {
      ios: 'itms-apps://itunes.apple.com/us/app/get-mobile/id844091049',
      android: 'market://details?id=com.cbord.get',
      web: {
        ios: 'https://apps.apple.com/us/app/get-mobile/id844091049',
        android: 'https://play.google.com/store/apps/details?id=com.cbord.get',
      },
    },
    nutrislice: {
      ios: 'itms-apps://itunes.apple.com/us/app/nutrislice/id567183091',
      android: 'market://details?id=com.nutrislice.schoollunch',
      web: {
        ios: 'https://apps.apple.com/us/app/nutrislice/id567183091',
        android: 'https://play.google.com/store/apps/details?id=com.nutrislice.schoollunch',
      },
    },
  },
};
