import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

interface EmergencyCardProps {
  onPress: () => void;
}


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

export default EmergencyCard;
