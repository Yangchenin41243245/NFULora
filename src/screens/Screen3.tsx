import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';
import { Screen3Props } from '../navigation/types';

const Screen3: React.FC<Screen3Props> = ({ navigation }) => {
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [devicesInfo, setDevicesInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    requestPermissionsAndFetchDevices();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const requestBluetoothPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const allGranted =
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

          if (!allGranted) {
            console.log('權限授予狀態:', granted);
            Alert.alert(
              '權限需求',
              '此應用需要藍芽和位置權限才能獲取已連接的藍芽設備資訊',
              [{ text: '確定' }]
            );
          }

          return allGranted;
        } catch (err) {
          console.warn('請求權限時發生錯誤:', err);
          return false;
        }
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn('請求權限時發生錯誤:', err);
          return false;
        }
      }
    }
    return true;
  };

  const requestPermissionsAndFetchDevices = async () => {
    setLoading(true);
    const hasPermission = await requestBluetoothPermissions();
    setPermissionGranted(hasPermission);

    if (hasPermission) {
      try {
        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        console.log('藍芽狀態:', enabled ? '已開啟' : '已關閉');
        setBluetoothEnabled(enabled);

        if (!enabled) {
          console.log('藍芽已關閉，正在請求開啟...');
          try {
            const enableResult = await RNBluetoothClassic.requestBluetoothEnabled();
            console.log('藍芽開啟結果:', enableResult);
            setBluetoothEnabled(enableResult);
            if (!enableResult) {
              Alert.alert(
                '藍芽錯誤',
                '請手動在設定中開啟藍芽',
                [{ text: '確定' }]
              );
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn('無法自動開啟藍芽:', err);
            Alert.alert(
              '藍芽錯誤',
              '無法自動開啟藍芽，請手動在設定中開啟藍芽',
              [{ text: '確定' }]
            );
            setLoading(false);
            return;
          }
        }

        await fetchDevices();
      } catch (error) {
        console.error('檢查藍芽狀態時發生錯誤:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      console.log('=== 開始獲取設備 ===');
      
      // 獲取已配對的設備
      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log('已配對設備數量:', paired.length);
      setPairedDevices(paired);

      // 獲取所有設備的詳細資訊
      const infos = await Promise.all(
        paired.map(device => fetchDeviceInfo(device))
      );

      setDevicesInfo(infos);
      setLoading(false);
    } catch (error) {
      console.error('獲取設備時發生錯誤:', error);
      setLoading(false);
      Alert.alert('錯誤', `獲取藍芽設備時發生錯誤: ${error}`);
    }
  };

  const fetchDeviceInfo = async (device: BluetoothDevice): Promise<any> => {
    try {
      console.log('正在獲取設備資訊...', device.name || device.id);

      let isConnected = false;
      try {
        isConnected = await device.isConnected();
      } catch (err) {
        console.log('無法檢查連接狀態', err);
      }

      console.log(`設備 ${device.name || device.id} 連接狀態:`, isConnected);

      const info: any = {
        id: device.id,
        name: device.name || '未知設備',
        address: device.address,
        isConnected: isConnected,
        bonded: device.bonded,
        deviceClass: device.deviceClass,
      };

      console.log(`設備 ${device.name || device.id} 資訊獲取完成`);
      return info;
    } catch (error) {
      console.error('獲取設備資訊時發生錯誤:', error);
      return {
        id: device.id,
        name: device.name || '未知設備',
        address: device.address,
        isConnected: false,
        error: '無法獲取完整設備資訊',
      };
    }
  };

  const refreshDevices = async () => {
    if (!permissionGranted) {
      await requestPermissionsAndFetchDevices();
    } else {
      setLoading(true);
      setPairedDevices([]);
      setDevicesInfo([]);
      await fetchDevices();
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      const isConnected = await device.isConnected();
      if (isConnected) {
        Alert.alert('提示', '設備已經連接');
        return;
      }

      Alert.alert('連接中', `正在連接到 ${device.name}...`);
      const connected = await device.connect();
      
      if (connected) {
        Alert.alert('成功', `已連接到 ${device.name}`);
        await refreshDevices();
      } else {
        Alert.alert('失敗', '無法連接到設備');
      }
    } catch (error) {
      console.error('連接錯誤:', error);
      Alert.alert('錯誤', `連接失敗: ${error}`);
    }
  };

  const disconnectFromDevice = async (device: BluetoothDevice) => {
    try {
      await device.disconnect();
      Alert.alert('成功', `已斷開與 ${device.name} 的連接`);
      await refreshDevices();
    } catch (error) {
      console.error('斷開錯誤:', error);
      Alert.alert('錯誤', `斷開失敗: ${error}`);
    }
  };

  if (!permissionGranted && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>需要藍芽權限</Text>
        <Text style={styles.permissionText}>
          此應用需要藍芽和位置權限才能顯示已連接設備資訊
        </Text>
        <Button title="授予權限" onPress={requestPermissionsAndFetchDevices} />
        <View style={styles.buttonSpacing} />
        <Button title="返回畫面 1" onPress={() => navigation.navigate('Screen1')} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          {scanning ? '正在掃描藍芽設備...' : '獲取藍芽設備中...'}
        </Text>
        <Text style={styles.stateText}>
          藍芽狀態: {bluetoothEnabled ? '已開啟' : '已關閉'}
        </Text>
      </View>
    );
  }

  if (devicesInfo.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>未找到藍芽設備</Text>
        <Text style={styles.stateText}>
          藍芽狀態: {bluetoothEnabled ? '已開啟' : '已關閉'}
        </Text>
        <Text style={styles.noDeviceText}>
          請確認:{'\n'}
          1. 有藍芽設備已配對至手機{'\n'}
          2. 藍芽已開啟{'\n'}
          3. 位置服務已開啟（Android 需要）{'\n'}
          4. 已授予所有必要權限
        </Text>
        <Button title="🔄 重新掃描" onPress={refreshDevices} />
        <View style={styles.buttonSpacing} />
        <Button title="返回畫面 1" onPress={() => navigation.navigate('Screen1')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          🎮 藍芽設備 ({devicesInfo.length})
        </Text>
        <Text style={styles.subtitle}>
          已配對設備: {pairedDevices.length}
        </Text>

        {devicesInfo.map((deviceInfo, index) => (
          <View key={deviceInfo.id} style={styles.deviceContainer}>
            <Text style={styles.deviceTitle}>
              設備 {index + 1}: {deviceInfo.name}
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>基本資訊</Text>
              <InfoRow label="設備名稱" value={deviceInfo.name} />
              <InfoRow label="設備 ID" value={deviceInfo.id} />
              <InfoRow label="設備地址" value={deviceInfo.address} />
              <InfoRow 
                label="連接狀態" 
                value={deviceInfo.isConnected ? '✅ 已連接' : '📡 未連接'} 
              />
              <InfoRow 
                label="配對狀態" 
                value={deviceInfo.bonded ? '✅ 已配對' : '❌ 未配對'} 
              />
              {deviceInfo.deviceClass && (
                <InfoRow 
                  label="設備類別" 
                  value={deviceInfo.deviceClass.toString()} 
                />
              )}
            </View>

            {deviceInfo.error && (
              <View style={styles.errorSection}>
                <Text style={styles.errorText}>⚠️ {deviceInfo.error}</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              {deviceInfo.isConnected ? (
                <Button 
                  title="斷開連接" 
                  onPress={() => {
                    const device = pairedDevices.find(d => d.id === deviceInfo.id);
                    if (device) disconnectFromDevice(device);
                  }}
                  color="#dc3545"
                />
              ) : (
                <Button 
                  title="連接設備" 
                  onPress={() => {
                    const device = pairedDevices.find(d => d.id === deviceInfo.id);
                    if (device) connectToDevice(device);
                  }}
                  color="#28a745"
                />
              )}
            </View>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <Button title="🔄 重新掃描" onPress={refreshDevices} />
          <View style={styles.buttonSpacing} />
          <Button title="返回畫面 1" onPress={() => navigation.navigate('Screen1')} />
        </View>
      </View>
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  deviceContainer: { marginBottom: 30 },
  deviceTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#333' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#333' 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center' 
  },
  stateText: { 
    marginTop: 10, 
    fontSize: 14, 
    color: '#999', 
    textAlign: 'center' 
  },
  permissionText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20, 
    paddingHorizontal: 20 
  },
  noDeviceText: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20, 
    paddingHorizontal: 20, 
    lineHeight: 22 
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  errorText: { fontSize: 14, color: '#856404' },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#007AFF' 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  label: { fontSize: 14, color: '#666', fontWeight: '600' },
  value: { fontSize: 14, color: '#333', flex: 1, textAlign: 'right' },
  buttonContainer: { marginTop: 20, marginBottom: 10 },
  buttonSpacing: { height: 10 },
});

export default Screen3;