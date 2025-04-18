import React from 'react';
import { View, Text } from 'react-native';

import { COLORS } from '~/constants/colors';

interface WelcomeCardProps {
  title: string;
  message: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, message }) => (
  <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
    <Text className="mb-1 text-lg font-bold" style={{ color: COLORS.secondary }}>
      {title}
    </Text>
    <Text className="text-gray-600">{message}</Text>
  </View>
);

export default WelcomeCard;
