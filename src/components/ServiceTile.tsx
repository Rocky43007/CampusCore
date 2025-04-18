import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';

interface ServiceTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  onPress: () => void;
}

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

export default ServiceTile;
