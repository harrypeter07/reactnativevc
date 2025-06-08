import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useScreenCapture } from '@/hooks/useScreenCapture';
import { useWebRTC } from '@/hooks/useWebRTC';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ShareControls } from '@/components/ShareControls';
import { HeaderBar } from '@/components/HeaderBar';

export default function ScreenShareScreen() {
  const [roomId, setRoomId] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const { captureStatus, startCapture, stopCapture } = useScreenCapture();
  const { 
    connectionState, 
    createRoom, 
    joinRoom, 
    leaveRoom, 
    localStream, 
    remoteStream,
    connectionQuality,
  } = useWebRTC();

  const handleCreateRoom = async () => {
    setIsHost(true);
    const room = await createRoom();
    if (room) {
      setRoomId(room);
      await startCapture();
    }
  };

  const handleJoinRoom = async (id: string) => {
    setIsHost(false);
    await joinRoom(id);
    setRoomId(id);
  };

  const handleLeaveRoom = async () => {
    await stopCapture();
    await leaveRoom();
    setRoomId('');
    setIsHost(false);
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Screen Share" />
      
      <View style={styles.content}>
        {roomId ? (
          <>
            <ConnectionStatus 
              status={connectionState} 
              quality={connectionQuality}
              roomId={roomId} 
              isHost={isHost}
            />
            
            <View style={styles.streamContainer}>
              {isHost ? (
                localStream ? (
                  <Text style={styles.sharingText}>You are sharing your screen</Text>
                ) : (
                  <Text style={styles.errorText}>Failed to capture screen</Text>
                )
              ) : (
                remoteStream ? (
                  <Text style={styles.viewingText}>Viewing shared screen</Text>
                ) : (
                  <Text style={styles.waitingText}>Waiting for host to share...</Text>
                )
              )}
            </View>

            <ShareControls 
              isHost={isHost}
              isConnected={isConnected}
              onLeave={handleLeaveRoom}
              captureStatus={captureStatus}
              startCapture={startCapture}
              stopCapture={stopCapture}
            />
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.setupContainer}>
            <Text style={styles.headerText}>Share Your Screen</Text>
            <Text style={styles.subHeaderText}>Connect with others and share your screen in real-time</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.option, styles.createOption]} 
                onPress={handleCreateRoom}
              >
                <Text style={styles.optionTitle}>Create Room</Text>
                <Text style={styles.optionDescription}>
                  Start a new screen sharing session and invite others to join
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.orText}>OR</Text>
              
              <JoinRoomForm onJoin={handleJoinRoom} />
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                {Platform.OS === 'web' 
                  ? 'On desktop browsers, you will need to select which window or tab to share.' 
                  : 'Due to platform limitations, screen sharing might be limited on mobile devices.'}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

interface JoinRoomFormProps {
  onJoin: (roomId: string) => void;
}

function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
  const [roomInput, setRoomInput] = useState('');
  
  const handleJoin = () => {
    if (roomInput.trim()) {
      onJoin(roomInput.trim());
    }
  };
  
  return (
    <View style={styles.joinContainer}>
      <Text style={styles.optionTitle}>Join Room</Text>
      <Text style={styles.optionDescription}>
        Enter a room code to join an existing screen sharing session
      </Text>
      
      <View style={styles.inputContainer}>
        <View style={styles.roomInput}>
          {/* This would be replaced with a proper TextInput in a real implementation */}
          <Text style={styles.roomInputText}>Enter room code</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          disabled={!roomInput.trim()}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  streamContainer: {
    flex: 1,
    backgroundColor: '#E1E6F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  setupContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1C2033',
    textAlign: 'center',
    marginBottom: 12,
  },
  subHeaderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4A5073',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  option: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  createOption: {
    backgroundColor: '#EBF5FF',
    borderWidth: 1,
    borderColor: '#B3D4FF',
  },
  optionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C2033',
    marginBottom: 8,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4A5073',
    lineHeight: 20,
  },
  orText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E92A4',
    textAlign: 'center',
    marginVertical: 16,
  },
  joinContainer: {
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  roomInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D0D5E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  roomInputText: {
    fontFamily: 'Inter-Regular',
    color: '#8E92A4',
  },
  joinButton: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  joinButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 196, 0, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC400',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#5D4A00',
    lineHeight: 20,
  },
  sharingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#007AFF',
  },
  viewingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#007AFF',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FF3B30',
  },
  waitingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#8E92A4',
  },
});