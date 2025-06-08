import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Play, Phone, Share2 } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

interface ShareControlsProps {
  isHost: boolean;
  isConnected: boolean;
  onLeave: () => void;
  captureStatus: 'idle' | 'capturing' | 'paused' | 'failed';
  startCapture: () => void;
  stopCapture: () => void;
}

export function ShareControls({
  isHost,
  isConnected,
  onLeave,
  captureStatus,
  startCapture,
  stopCapture,
}: ShareControlsProps) {
  const isCapturing = captureStatus === 'capturing';

  const handleToggleCapture = () => {
    if (isCapturing) {
      stopCapture();
    } else {
      startCapture();
    }
  };

  const handleInvite = () => {
    // Share the room code or link
    const message = 'Join my screen sharing session!';
    // If you have access to the roomId, you can include it here
    // For now, just share a generic message
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Screen Share Invite',
        text: message,
        // url: 'https://your-app-link.com/room/' + roomId, // Uncomment if you have a room link
      });
    } else if (Sharing.isAvailableAsync) {
      Sharing.isAvailableAsync().then((available) => {
        if (available) {
          Sharing.shareAsync(undefined, {
            dialogTitle: 'Screen Share Invite',
            mimeType: 'text/plain',
            UTI: 'public.text',
            message,
          });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {isHost && isConnected && (
        <View style={styles.hostControls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.captureToggleButton,
              isCapturing ? styles.pauseButton : styles.startButton,
            ]}
            onPress={handleToggleCapture}
          >
            {isCapturing ? (
              <>
                <Pause color="#FFFFFF\" size={20} />
                <Text style={styles.buttonText}>Pause</Text>
              </>
            ) : (
              <>
                <Play color="#FFFFFF" size={20} />
                <Text style={styles.buttonText}>Resume</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.shareButton]}
            onPress={handleInvite}
          >
            <Share2 color="#FFFFFF" size={20} />
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.controlButton, styles.endButton]}
        onPress={onLeave}
      >
        <Phone color="#FFFFFF" size={20} style={styles.rotatedPhone} />
        <Text style={styles.buttonText}>End</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hostControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  captureToggleButton: {
    flex: 1,
    marginRight: 12,
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  rotatedPhone: {
    transform: [{ rotate: '135deg' }],
  },
});
