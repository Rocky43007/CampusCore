import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'App';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import DefaultModal from './DefaultModal';
import { COLORS } from '../constants/colors';

interface AppHeaderProps {
  title: string;
  accentTitle: string;
  showBackButton?: boolean; // Optional: Show back button
  navigation?: NavigationProp<RootStackParamList>; // Optional: Pass navigation prop from screen
  style?: StyleProp<ViewStyle>; // Optional style prop for the container
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  accentTitle,
  showBackButton = false, // Default to false
  navigation, // Use the passed navigation prop
  style,
}) => {
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState<boolean>(false);

  // Function to handle the back button press
  const handleGoBack = () => {
    // Check if navigation prop exists and if it's possible to go back
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      // Optional: handle case where going back isn't possible (e.g., first screen)
      console.warn('AppHeader: Cannot go back from this screen.');
      // Example: Navigate home if back isn't possible from a non-home screen
      // if (navigation && navigation.getState()?.routes[navigation.getState().index]?.name !== 'Home') {
      //   navigation.navigate('Home');
      // }
    }
  };

  return (
    <>
      <View style={[{ backgroundColor: COLORS.primary }, style]}>
        <BlurView intensity={10} tint="dark" className="overflow-hidden">
          {/* Use relative parent for absolute positioning inside */}
          <View className="relative h-16 flex-row items-center justify-center px-4 py-3">
            {/* Left Button (Back Button - Absolutely Positioned) */}
            {showBackButton && navigation && (
              <TouchableOpacity
                onPress={handleGoBack}
                activeOpacity={0.7}
                // Position absolute left, centered vertically
                className="absolute bottom-0 left-4 top-0 z-10 flex-row items-center justify-center p-1">
                <Ionicons name="arrow-back" size={26} color="white" />
              </TouchableOpacity>
            )}

            {/* Center Title */}
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-white">{title}</Text>
              <Text className="text-2xl font-bold" style={{ color: COLORS.accent }}>
                {accentTitle}
              </Text>
            </View>

            {/* Right Button (Notifications - Absolutely Positioned) */}
            <TouchableOpacity
              activeOpacity={0.7}
              // Position absolute right, centered vertically
              className="absolute bottom-0 right-4 top-0 z-10 flex-row items-center justify-center rounded-full p-2"
              onPress={() => {
                // Handle notification button press
                setIsNotificationsModalVisible(!isNotificationsModalVisible);
              }}>
              {/* Optional: Add subtle background on press */}
              {/* className="absolute right-4 top-0 bottom-0 z-10 flex items-center justify-center rounded-full bg-white/10 p-2" */}
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
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
    </>
  );
};

export default AppHeader;
