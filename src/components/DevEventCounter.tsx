// src/components/DevEventCounter.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import global styles if using NativeWind
import '../../global.css';

interface DevEventCounterProps {
  filteredCount: number;
  totalCount: number;
}

const DevEventCounter: React.FC<DevEventCounterProps> = ({ filteredCount, totalCount }) => {
  // Simple component that shows Filtered / Total counts
  return (
    // Position absolute, bottom right corner, semi-transparent background
    <View
      style={styles.counterContainer}
      className="absolute bottom-4 right-4 rounded-md bg-black/60 px-2.5 py-1 shadow-lg">
      <Text style={styles.counterText} className="text-xs font-semibold text-white">
        {filteredCount} / {totalCount} Events
      </Text>
    </View>
  );
};

// Basic StyleSheet for positioning and base styles
const styles = StyleSheet.create({
  counterContainer: {
    position: 'absolute',
    bottom: 16, // bottom-4
    right: 16, // right-4
    zIndex: 50, // Ensure it floats above most content
    // Background, padding, rounding applied via className
  },
  counterText: {
    // Color, size, weight applied via className
  },
});

export default React.memo(DevEventCounter); // Memoize to prevent re-renders if counts don't change
