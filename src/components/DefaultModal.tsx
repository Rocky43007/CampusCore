import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

import { COLORS } from '~/constants/colors';

interface DefaultModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DefaultModal: React.FC<DefaultModalProps> = ({ isVisible, onClose, title, children }) => (
  <ReactNativeModal
    isVisible={isVisible}
    statusBarTranslucent
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={{ margin: 0, justifyContent: 'flex-end' }}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.5}
    propagateSwipe>
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
      }}>
      {/* Modal Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          backgroundColor: COLORS.light,
        }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: COLORS.dark,
          }}>
          {title}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      {children}
    </View>
  </ReactNativeModal>
);

export default DefaultModal;
