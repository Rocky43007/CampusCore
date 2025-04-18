import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface TransportOptionProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

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

export default TransportOption;
