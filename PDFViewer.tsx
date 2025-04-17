import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  // Determine the source URL based on platform
  const source =
    Platform.OS === 'android'
      ? { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` }
      : { uri: pdfUrl }; // iOS can render PDFs directly

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={source}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#990000" />
          </View>
        )}
      />
    </View>
  );
};

export default PDFViewer;
