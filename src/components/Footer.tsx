// src/components/AppFooter.tsx
import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import * as Application from 'expo-application'; // Import expo-application

// Import shared constants for styling if needed (though not strictly used here)
// import { COLORS } from '~/constants/colors';

// Import global styles if AppFooter uses NativeWind
// Adjust path if needed
import '../../global.css';

const AppFooter: React.FC = () => {
  // Get user-facing version (like 1.0.0) using expo-application [4]
  const appVersion = Application.nativeApplicationVersion ?? '0.0.0';
  // Optionally get build version (like 1, 2, 3) if needed:
  // const buildVersion = Application.nativeBuildVersion ?? '?';
  const currentYear = new Date().getFullYear();

  return (
    // Slightly increased vertical padding, slightly lighter border
    <View
      className="border-t border-gray-200/80 bg-slate-50 px-4 py-4"
      // StyleSheet equivalent:
      // style={styles.footerContainer}
    >
      <Text
        className="text-center text-xs font-medium text-gray-600" // Slightly darker gray, medium weight
        // StyleSheet equivalent:
        // style={styles.footerText}
      >
        © {currentYear} CampusCore v{appVersion}
      </Text>
    </View>
  );
};

// Optional StyleSheet for reference or more complex styles
// const styles = StyleSheet.create({
//   footerContainer: {
//     borderTopColor: 'rgba(229, 231, 235, 0.8)', // border-gray-200/80
//     borderTopWidth: 1,
//     backgroundColor: '#F8FAFC', // bg-slate-50
//     paddingHorizontal: 16, // px-4
//     paddingVertical: 16, // py-4
//   },
//   footerText: {
//     textAlign: 'center',
//     fontSize: 12, // text-xs
//     fontWeight: '500', // font-medium
//     color: '#4B5563', // text-gray-600
//   },
// });

export default AppFooter;
