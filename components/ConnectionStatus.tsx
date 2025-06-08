import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Copy, CheckCircle, AlertCircle, WifiOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface ConnectionStatusProps {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'failed';
  quality?: 'excellent' | 'good' | 'poor' | 'unknown';
  roomId: string;
  isHost: boolean;
}

export function ConnectionStatus({
  status,
  quality = 'unknown',
  roomId,
  isHost,
}: ConnectionStatusProps) {
  const handleCopyRoomId = () => {
    if (Platform.OS === 'web') {
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(roomId).then(() => {
          // Optionally show a notification or toast
        });
      }
    } else {
      Clipboard.setStringAsync(roomId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#34C759'; // Green
      case 'connecting':
        return '#FF9500'; // Orange
      case 'disconnected':
      case 'failed':
        return '#FF3B30'; // Red
      default:
        return '#8E92A4'; // Gray
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Not Connected';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle color="#34C759" size={18} />;
      case 'connecting':
        return <AlertCircle color="#FF9500" size={18} />;
      case 'disconnected':
      case 'failed':
        return <WifiOff color="#FF3B30" size={18} />;
      default:
        return null;
    }
  };

  const getQualityText = () => {
    if (status !== 'connected') return '';

    switch (quality) {
      case 'excellent':
        return 'Excellent Connection';
      case 'good':
        return 'Good Connection';
      case 'poor':
        return 'Poor Connection';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor() }]}>
      <View style={styles.statusSection}>
        <View style={styles.statusHeader}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        {quality !== 'unknown' && status === 'connected' && (
          <Text style={styles.qualityText}>{getQualityText()}</Text>
        )}
      </View>

      {isHost && (
        <View style={styles.roomSection}>
          <Text style={styles.roomLabel}>Room Code:</Text>
          <View style={styles.roomIdContainer}>
            <Text style={styles.roomId}>{roomId}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyRoomId}
            >
              <Copy color="#007AFF" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusSection: {
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  qualityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E92A4',
    marginLeft: 26,
  },
  roomSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  roomLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4A5073',
    marginBottom: 4,
  },
  roomIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomId: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C2033',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
});
