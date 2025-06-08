import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Play, Phone, Share2 } from 'lucide-react-native';

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
  stopCapture
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
    // TODO: Implement invite functionality (e.g., share room link or code)
  };

  return (
    <View style={styles.container}>
      {isHost && isConnected && (
        <View style={styles.hostControls}>
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              styles.captureToggleButton,
              isCapturing ? styles.pauseButton : styles.startButton
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
          
          <TouchableOpacity style={[styles.controlButton, styles.shareButton]} onPress={handleInvite}>
          <TouchableOpacity style={[styles.controlButton, styles.shareButton]}>
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