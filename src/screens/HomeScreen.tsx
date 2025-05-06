import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { BlurView } from 'expo-blur';
import { JSX, useState } from 'react';
import { View, Text, ScrollView, Linking, Platform, StatusBar } from 'react-native';
import '../../global.css';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '~/components/AppHeader';
import DefaultModal from '~/components/DefaultModal';
import EmergencyCard from '~/components/EmergencyCard';
import PreviewModal from '~/components/PreviewModal';
import QuickLinkItem from '~/components/QuickLinkItem';
import SectionTitle from '~/components/SectionTitle';
import ServiceTile from '~/components/ServiceTile';
import TransportOption from '~/components/TransportOption';
import WelcomeCard from '~/components/WelcomeCard';
import { APP_LINKS } from '~/constants/appLinks';
import { COLORS } from '~/constants/colors';
import { IServiceTile, QuickLink } from '~/types';
import { openAppLink } from '~/utils/linking';

// =======================================
// Navigation Type
// =======================================
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// =======================================
// Main App Component
// =======================================
export default function HomeScreen({ navigation }: HomeScreenProps): JSX.Element {
  const insets = useSafeAreaInsets();

  // State management
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [isPdfPreview, setIsPdfPreview] = useState<boolean>(false);
  const [isTransportModalVisible, setIsTransportModalVisible] = useState<boolean>(false);
  const [isDiningModalVisible, setIsDiningModalVisible] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

  const serviceTiles: IServiceTile[] = [
    {
      icon: 'calendar-outline',
      title: 'Schedule',
      color: COLORS.secondary,
      link: () => setIsAlertVisible(true),
    },
    {
      icon: 'book-outline',
      title: 'Courses',
      color: COLORS.secondary,
      link: () => setIsAlertVisible(true),
    },
    {
      icon: 'people-outline',
      title: 'Community',
      color: COLORS.secondary,
      link: () => navigation.navigate('Events'),
    },
    {
      icon: 'library-outline',
      title: 'Resources',
      color: COLORS.tertiary,
      link: () => setIsAlertVisible(true),
    },
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
    {
      icon: 'fast-food-outline',
      title: 'Dining',
      color: COLORS.primary,
      link: () => setIsDiningModalVisible(true),
    },
    {
      icon: 'print-sharp',
      title: 'Printing',
      color: COLORS.primary,
      link: () => openAppLink(APP_LINKS.printing),
    },
    {
      icon: 'person-outline',
      title: 'Profile',
      color: COLORS.primary,
      link: () => navigation.navigate('Profile'),
    },
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
    // Start a phone call to SBU Police
    // Note: This will only work on a physical device, not in a simulator
    // and requires the appropriate permissions
    Linking.openURL('tel:6316323333');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View className="flex-1">
        {/* <StatusBar
          barStyle="light-content"
          backgroundColor="#01543f"
          translucent
          animated
          // hidden={false}
        />

        {/* Main Content with adjusted padding for status bar */}
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            backgroundColor: '#900000',
          }}>
          {/* Header */}
          <AppHeader title="Campus" accentTitle="Core" />

          {/* Main Content */}
          <ScrollView className="flex-1 bg-slate-50 px-4 pt-4">
            {/* Emergency Card */}
            <EmergencyCard onPress={handleEmergencyPress} />

            {/* Welcome Card */}
            <WelcomeCard
              title="Welcome, Seawolf!"
              message="Your campus resources in one place. What would you like to access today?"
            />
            {/* <WelcomeCard
              title="Welcome, Bearcat!"
              message="Your campus resources in one place. What would you like to access today?"
            /> */}

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
          <DefaultModal
            isVisible={isDiningModalVisible}
            onClose={() => setIsDiningModalVisible(false)}
            title="Dining Applications">
            <View style={{ padding: 20 }}>
              <Text
                style={{ fontSize: 16, color: COLORS.dark, marginBottom: 16, textAlign: 'center' }}>
                Choose the following dining application
              </Text>

              <TransportOption
                title="Nutrislice"
                description="View menus, nutrition information & order food for pickup"
                icon="fast-food-outline"
                color={COLORS.secondary}
                onPress={() => {
                  openAppLink(APP_LINKS.dining.nutrislice);
                }}
              />

              <TransportOption
                title="GET mobile"
                description="Track your meal plan balance & transactions"
                icon="receipt-outline"
                color={COLORS.tertiary}
                onPress={() => {
                  openAppLink(APP_LINKS.dining.get);
                }}
              />
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
            isVisible={isAlertVisible}
            onClose={() => setIsAlertVisible(false)}
            title="Feature Unavailable">
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
                <Ionicons name="warning-outline" size={32} color={COLORS.tertiary} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.dark,
                  marginBottom: 4,
                }}>
                This feature is not available yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.tertiary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                We're working hard to bring you this feature. Stay tuned for updates!
              </Text>
            </View>
          </DefaultModal>
        </View>
      </View>
    </>
  );
}
