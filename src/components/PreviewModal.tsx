import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import WebView from 'react-native-webview';

import { COLORS } from '~/constants/colors';

interface PreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  url: string;
  isPdf: boolean;
  onOpenExternal: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isVisible,
  onClose,
  url,
  isPdf,
  onOpenExternal,
}) => (
  <ReactNativeModal
    isVisible={isVisible}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    style={{ margin: 0 }}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.5}
    propagateSwipe>
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.8,
        marginTop: 'auto',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
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
          {isPdf ? 'Campus Map (PDF)' : url.replace(/^https?:\/\//, '').split('/')[0]}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content - WebView */}
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom Action Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          backgroundColor: COLORS.light,
        }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            flex: 1,
            marginRight: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            alignItems: 'center',
          }}>
          <Text style={{ color: COLORS.dark, fontWeight: '600' }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onOpenExternal}
          style={{
            flex: 1,
            marginLeft: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: COLORS.secondary,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {isPdf ? 'Open in PDF Viewer' : 'Open in Browser'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </ReactNativeModal>
);

export default PreviewModal;
