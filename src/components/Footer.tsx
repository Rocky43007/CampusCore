// import * as Application from 'expo-application';
import React from 'react';
import { View, Text } from 'react-native';

import '../../global.css';

const AppFooter: React.FC = () => {
  // const appVersion = Application.nativeApplicationVersion ?? '0.0.0'; // TO BE USED WHEN APPLICATION IS NATIVE BUILT AND NOT EXPO GO
  const currentYear = new Date().getFullYear();

  return (
    <View className="border-t border-gray-200/80 bg-slate-50 px-4 py-4">
      <Text className="text-center text-xs font-medium text-gray-600">
        © {currentYear} CampusCore v1.0.0
      </Text>
    </View>
  );
};

export default AppFooter;
