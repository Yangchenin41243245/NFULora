// filepath: src/screens/Screen2.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';

const Screen2: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return 'https://' + trimmed;
    }
    return trimmed;
  };

  const handleGo = () => {
    const normalized = normalizeUrl(inputUrl);
    setInputUrl(normalized);
    setCurrentUrl(normalized);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 網址列 */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.input}
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={handleGo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          placeholder="輸入網址..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleGo}>
          <Text style={styles.buttonText}>前往</Text>
        </TouchableOpacity>
      </View>

      {/* 載入指示器 */}
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color="#007AFF"
        />
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          setInputUrl(navState.url);
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 38,
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#000',
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  webview: {
    flex: 1,
  },
});

export default Screen2;