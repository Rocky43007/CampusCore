import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '~/constants/colors';

interface QuickLinkItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  isLast: boolean;
  onPress: () => void;
}

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

export default QuickLinkItem;
