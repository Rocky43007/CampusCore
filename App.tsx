import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from 'App';
import { BlurView } from 'expo-blur';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Linking,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import './global.css';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

// =======================================
// Type Definitions
// =======================================

interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  light: string;
  dark: string;
  accent: string;
}

interface WebLink {
  ios: string;
  android: string;
  browser?: string;
}

interface AppLink {
  ios: string;
  android: string;
  web: string | WebLink;
}

interface AppLinks {
  fitness: AppLink;
  printing: AppLink;
  transport: {
    bus: AppLink;
    bike: AppLink;
  };
}

interface IServiceTile {
  icon: string;
  title: string;
  color: string;
  link?: () => void;
}

interface QuickLink {
  title: string;
  icon: string;
  link: string;
}

interface AppHeaderProps {
  title: string;
  accentTitle: string;
  onNotificationPress: () => void;
}

interface EmergencyCardProps {
  onPress: () => void;
}

interface WelcomeCardProps {
  title: string;
  message: string;
}

interface SectionTitleProps {
  title: string;
}

interface ServiceTileProps {
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
}

interface QuickLinkItemProps {
  icon: string;
  title: string;
  isLast: boolean;
  onPress: () => void;
}

interface PreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  url: string;
  isPdf: boolean;
  onOpenExternal: () => void;
}

interface TransportOptionProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface DefaultModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// =======================================
// Constants and Configuration
// =======================================

// StonyBrook color palette - centralized for consistent design language
const COLORS: ColorPalette = {
  primary: '#990000', // StonyBrook Red
  secondary: '#003C71', // StonyBrook Blue
  tertiary: '#6D6E71', // StonyBrook Gray
  light: '#F2F2F2',
  dark: '#333333',
  accent: '#FFD100', // StonyBrook Gold
};

// App links configuration - easy to update when app IDs change
const APP_LINKS: AppLinks = {
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
};

// =======================================
// Utility Functions
// =======================================

/**
 * Opens an app or its store page based on platform
 */
const openAppLink = (appLinks: AppLink): void => {
  const appStoreLink: string = Platform.OS === 'ios' ? appLinks.ios : appLinks.android;
  let webLink: string;

  if (typeof appLinks.web === 'string') {
    webLink = appLinks.web;
  } else {
    webLink = Platform.OS === 'ios' ? appLinks.web.ios : appLinks.web.android;
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
      if (typeof appLinks.web !== 'string' && appLinks.web.browser) {
        Linking.openURL(appLinks.web.browser);
      } else {
        Linking.openURL(webLink);
      }
    });
};

// =======================================
// Reusable UI Components
// =======================================

/**
 * AppHeader - Reusable header component with blur effect
 */
const AppHeader: React.FC<AppHeaderProps> = ({ title, accentTitle, onNotificationPress }) => (
  <View style={{ backgroundColor: COLORS.primary }}>
    <BlurView intensity={10} tint="dark" className="overflow-hidden">
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold text-white">{title}</Text>
          <Text className="text-2xl font-bold" style={{ color: COLORS.accent }}>
            {accentTitle}
          </Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full bg-white/20 p-2"
            onPress={onNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  </View>
);

/**
 * EmergencyCard - Reusable emergency services card
 */
const EmergencyCard: React.FC<EmergencyCardProps> = ({ onPress }) => (
  <TouchableOpacity
    className="mb-6 overflow-hidden rounded-2xl shadow-md"
    activeOpacity={0.85}
    onPress={onPress}>
    <ImageBackground
      source={{
        uri: 'https://stonybrook.edu/commcms/_images/section-backgrounds/red-rays/red-rays-cropped-1.png',
      }}
      className="overflow-hidden"
      imageStyle={{ opacity: 0.85 }}>
      <View className="overflow-hidden bg-black/30 bg-blend-multiply">
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-red-600 p-3">
              <Ionicons name="call-outline" size={24} color="white" />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-bold text-white">Emergency Services</Text>
              <Text className="text-white/80">Tap for immediate assistance</Text>
            </View>
          </View>
          <View className="rounded-full bg-white/20 p-1">
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

/**
 * WelcomeCard - Reusable welcome message card
 */
const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, message }) => (
  <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
    <Text className="mb-1 text-lg font-bold" style={{ color: COLORS.secondary }}>
      {title}
    </Text>
    <Text className="text-gray-600">{message}</Text>
  </View>
);

/**
 * SectionTitle - Reusable section title component
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <Text className="mb-3 text-xl font-bold" style={{ color: COLORS.secondary }}>
    {title}
  </Text>
);

/**
 * ServiceTile - Reusable service tile component
 */
const ServiceTile: React.FC<ServiceTileProps> = ({ icon, title, color, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="mb-5 items-center justify-center rounded-xl bg-white p-3 shadow-sm"
    style={{
      width: '31%',
      shadowColor: color,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
    }}
    onPress={onPress}>
    <View className="mb-2 rounded-full p-3" style={{ backgroundColor: `${color}15` }}>
      <Ionicons name={icon as any} size={26} color={color} />
    </View>
    <Text className="text-center text-sm font-medium text-gray-800">{title}</Text>
  </TouchableOpacity>
);

/**
 * QuickLinkItem - Reusable quick link item component
 */
const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ icon, title, isLast, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between border-b border-gray-100 p-4"
    activeOpacity={0.7}
    onPress={onPress}
    style={{ borderBottomWidth: isLast ? 0 : 1 }}>
    <View className="flex-row items-center space-x-3">
      <Ionicons name={icon as any} size={20} color={COLORS.tertiary} className="px-2" />
      <Text className="font-medium" style={{ color: COLORS.dark }}>
        {title}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.tertiary} />
  </TouchableOpacity>
);

/**
 * PreviewModal - Reusable modal for previewing content
 */
const PreviewModal: React.FC<PreviewModalProps> = ({
  isVisible,
  onClose,
  url,
  isPdf,
  onOpenExternal,
}) => (
  <ReactNativeModal
    isVisible={isVisible}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={{ margin: 0 }}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.5}
    propagateSwipe>
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.8,
        marginTop: 'auto',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}>
      {/* Modal Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          backgroundColor: COLORS.light,
        }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: COLORS.dark,
          }}>
          {isPdf ? 'Campus Map (PDF)' : url.replace(/^https?:\/\//, '').split('/')[0]}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content - WebView */}
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom Action Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          backgroundColor: COLORS.light,
        }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            flex: 1,
            marginRight: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            alignItems: 'center',
          }}>
          <Text style={{ color: COLORS.dark, fontWeight: '600' }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onOpenExternal}
          style={{
            flex: 1,
            marginLeft: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: COLORS.secondary,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {isPdf ? 'Open in PDF Viewer' : 'Open in Browser'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </ReactNativeModal>
);

/**
 * TransportOption - Reusable transport option button
 */
const TransportOption: React.FC<TransportOptionProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
}) => (
  <TouchableOpacity
    style={{
      backgroundColor: color,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    }}
    activeOpacity={0.7}
    onPress={onPress}>
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 50,
        padding: 12,
        marginRight: 16,
      }}>
      <Ionicons name={icon as any} size={32} color="white" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="white" />
  </TouchableOpacity>
);

/**
 * DefaultModal - Reusable modal component with consistent styling
 */
const DefaultModal: React.FC<DefaultModalProps> = ({ isVisible, onClose, title, children }) => (
  <ReactNativeModal
    isVisible={isVisible}
    statusBarTranslucent
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={{ margin: 0, justifyContent: 'flex-end' }}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.5}
    propagateSwipe>
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
      }}>
      {/* Modal Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          backgroundColor: COLORS.light,
        }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: COLORS.dark,
          }}>
          {title}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      {children}
    </View>
  </ReactNativeModal>
);

// =======================================
// Main App Component
// =======================================

function Home(): JSX.Element {
  const insets = useSafeAreaInsets();

  // State management
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [isPdfPreview, setIsPdfPreview] = useState<boolean>(false);
  const [isTransportModalVisible, setIsTransportModalVisible] = useState<boolean>(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'android') return;
      // enables edge-to-edge mode
      await NavigationBar.setPositionAsync('absolute');
      // transparent backgrounds to see through
      await NavigationBar.setBackgroundColorAsync('#ffffff00');
    })();
  }, []);

  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Data definitions - centralized for easy updates
  const serviceTiles: IServiceTile[] = [
    { icon: 'calendar-outline', title: 'Schedule', color: COLORS.secondary },
    { icon: 'book-outline', title: 'Courses', color: COLORS.secondary },
    {
      icon: 'people-outline',
      title: 'Community',
      color: COLORS.secondary,
      // link: () => navigation.navigate('Events'),
    },
    { icon: 'library-outline', title: 'Resources', color: COLORS.tertiary },
    {
      icon: 'barbell-outline',
      title: 'Fitness',
      color: COLORS.tertiary,
      link: () => openAppLink(APP_LINKS.fitness),
    },
    {
      icon: 'bus-outline',
      title: 'Transport',
      color: COLORS.tertiary,
      link: () => setIsTransportModalVisible(true),
    },
    { icon: 'fast-food-outline', title: 'Dining', color: COLORS.primary },
    {
      icon: 'print-sharp',
      title: 'Printing',
      color: COLORS.primary,
      link: () => openAppLink(APP_LINKS.printing),
    },
    { icon: 'settings-outline', title: 'Settings', color: COLORS.primary },
  ];

  const quickLinks: QuickLink[] = [
    {
      title: 'Academic Calendar',
      icon: 'calendar-outline',
      link: 'https://www.stonybrook.edu/commcms/registrar/calendars/academic_calendars',
    },
    {
      title: 'Campus Map',
      icon: 'map-outline',
      link: 'https://www.stonybrook.edu/far-beyond/downloads/pdf/maps/campus-map-1-22-ada.pdf',
    },
    {
      title: 'Brightspace',
      icon: 'book-outline',
      link: 'https://mycourses.stonybrook.edu/',
    },
    {
      title: 'SOLAR',
      icon: 'person-outline',
      link: 'https://prod.ps.stonybrook.edu/csprods/signon.html',
    },
  ];

  // Event handlers
  const handleLinkPress = (url: string): void => {
    // Check if the URL is a PDF
    const isPdf = url.toLowerCase().endsWith('.pdf');
    setIsPdfPreview(isPdf);

    if (isPdf && Platform.OS === 'android') {
      // For Android PDFs, use Google Docs viewer
      const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
      setPreviewUrl(googleDocsUrl);
    } else {
      // For iOS PDFs and non-PDF links
      setPreviewUrl(url);
    }

    setIsPreviewVisible(true);
  };

  const handleOpenExternalLink = (): void => {
    if (previewUrl) {
      // For Google Docs URLs, extract the original URL
      if (previewUrl.includes('docs.google.com/gview')) {
        const originalUrl = new URL(previewUrl).searchParams.get('url');
        if (originalUrl) {
          Linking.openURL(originalUrl);
        } else {
          Linking.openURL(previewUrl);
        }
      } else {
        Linking.openURL(previewUrl);
      }
      setIsPreviewVisible(false);
    }
  };

  const handleClosePreview = (): void => {
    setIsPreviewVisible(false);
    setPreviewUrl('');
    setIsPdfPreview(false);
  };

  const handleEmergencyPress = (): void => {
    console.log('Emergency services pressed');
    // Implement emergency services functionality
  };

  const handleNotificationPress = (): void => {
    setIsNotificationsModalVisible(true);
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      )}
      <SafeAreaView className="flex-1 bg-slate-50">
        {/* Status Bar */}
        {Platform.OS === 'android' && (
          <StatusBar barStyle="light-content" backgroundColor="#900000" animated />
        )}

        {/* Main Content with adjusted padding for status bar */}
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? insets.top : 0,
            backgroundColor: 'white',
          }}>
          {/* Header */}
          <AppHeader
            title="Campus"
            accentTitle="Core"
            onNotificationPress={handleNotificationPress}
          />

          {/* Main Content */}
          <ScrollView className="flex-1 px-4 pt-4">
            {/* Emergency Card */}
            <EmergencyCard onPress={handleEmergencyPress} />

            {/* Welcome Card */}
            <WelcomeCard
              title="Welcome, Seawolf!"
              message="Your campus resources in one place. What would you like to access today?"
            />

            {/* Campus Services Grid */}
            <SectionTitle title="Campus Services" />
            <View className="flex-row flex-wrap justify-between">
              {serviceTiles.map((tile, index) => (
                <ServiceTile
                  key={index}
                  icon={tile.icon}
                  title={tile.title}
                  color={tile.color}
                  onPress={tile.link ? tile.link : () => console.log(`Pressed ${tile.title}`)}
                />
              ))}
            </View>

            {/* Quick Links */}
            <SectionTitle title="Quick Links" />
            <View className="mb-6 overflow-hidden rounded-xl bg-white/80 shadow-sm backdrop-blur-md">
              <BlurView intensity={30} tint="light">
                {quickLinks.map((item, index) => (
                  <QuickLinkItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    isLast={index === quickLinks.length - 1}
                    onPress={() => handleLinkPress(item.link)}
                  />
                ))}
              </BlurView>
            </View>
          </ScrollView>

          {/* Modals */}
          <DefaultModal
            isVisible={isTransportModalVisible}
            onClose={() => setIsTransportModalVisible(false)}
            title="Campus Transportation">
            <View style={{ padding: 20 }}>
              <Text
                style={{ fontSize: 16, color: COLORS.dark, marginBottom: 16, textAlign: 'center' }}>
                Choose your preferred transportation method
              </Text>

              <TransportOption
                title="ETA Spot"
                description="Track SBU shuttle buses in real-time"
                icon="bus-outline"
                color={COLORS.secondary}
                onPress={() => {
                  openAppLink(APP_LINKS.transport.bus);
                }}
              />

              <TransportOption
                title="PBSC Bike Share"
                description="Locate and rent bikes around campus"
                icon="bicycle-outline"
                color={COLORS.tertiary}
                onPress={() => {
                  openAppLink(APP_LINKS.transport.bike);
                }}
              />

              {/* Info Section */}
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 8,
                }}>
                <Text style={{ fontSize: 14, color: COLORS.dark, lineHeight: 20 }}>
                  <Text style={{ fontWeight: 'bold' }}>New in 2025:</Text> The ETA Spot app replaces
                  DoubleMap for bus tracking and features real-time occupancy data, trip alerts, and
                  accessibility features.
                </Text>
              </View>
            </View>
          </DefaultModal>

          <PreviewModal
            isVisible={isPreviewVisible}
            onClose={handleClosePreview}
            url={previewUrl}
            isPdf={isPdfPreview}
            onOpenExternal={handleOpenExternalLink}
          />

          <DefaultModal
            isVisible={isNotificationsModalVisible}
            onClose={() => setIsNotificationsModalVisible(false)}
            title="Notifications">
            <View
              style={{
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: COLORS.light,
                  borderRadius: 50,
                  padding: 16,
                  marginBottom: 12,
                }}>
                <Ionicons name="notifications-off-outline" size={32} color={COLORS.tertiary} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.dark,
                  marginBottom: 4,
                }}>
                No notifications found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.tertiary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                We'll notify you when there's something new
              </Text>
            </View>
          </DefaultModal>
        </View>
      </SafeAreaView>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}
