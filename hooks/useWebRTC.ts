import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { io, Socket } from 'socket.io-client';

// Mock values for the demo
const SIGNALING_SERVER_URL = 'https://your-signaling-server.com';

type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed';
type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'unknown';

export function useWebRTC() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('idle');
  const [connectionQuality, setConnectionQuality] =
    useState<ConnectionQuality>('unknown');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const roomIdRef = useRef<string | null>(null);

  // For demo purposes, we'll use simplified connection quality monitoring
  useEffect(() => {
    let qualityInterval: any;

    if (connectionState === 'connected' && Platform.OS === 'web') {
      qualityInterval = setInterval(() => {
        if (peerConnectionRef.current) {
          // TODO: Use getStats() to analyze the connection quality instead of random values
          const randomQuality = Math.random();
          if (randomQuality > 0.7) {
            setConnectionQuality('excellent');
          } else if (randomQuality > 0.4) {
            setConnectionQuality('good');
          } else {
            setConnectionQuality('poor');
          }
        }
      }, 5000);
    }

    return () => {
      if (qualityInterval) clearInterval(qualityInterval);
    };
  }, [connectionState]);

  // Initialize WebRTC peer connection
  const initializePeerConnection = useCallback(() => {
    if (Platform.OS !== 'web') {
      console.warn('WebRTC is only fully supported on web platform');
      return null;
    }

    try {
      // In a real implementation, you would use proper STUN/TURN servers
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      // @ts-ignore - RTCPeerConnection exists in web but not in RN types
      const pc = new RTCPeerConnection(configuration);

      // Set up event handlers
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId: roomIdRef.current,
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.oniceconnectionstatechange = () => {
        switch (pc.iceConnectionState) {
          case 'connected':
          case 'completed':
            setConnectionState('connected');
            break;
          case 'disconnected':
          case 'closed':
            setConnectionState('disconnected');
            break;
          case 'failed':
            setConnectionState('failed');
            break;
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setConnectionState('failed');
      return null;
    }
  }, []);

  // Connect to signaling server
  const connectToSignalingServer = useCallback(() => {
    if (socketRef.current) return;

    try {
      // TODO: Connect to real signaling server using socket.io
      // const socket = io(SIGNALING_SERVER_URL);
      const mockSocket = {
        on: (event: string, callback: Function) => {},
        emit: (event: string, data: any) => {},
        disconnect: () => {},
      } as unknown as Socket;

      socketRef.current = mockSocket;

      // TODO: Set up real event listeners for signaling events
    } catch (error) {
      console.error('Error connecting to signaling server:', error);
      setConnectionState('failed');
    }
  }, []);

  // Create a new room
  const createRoom = useCallback(async (): Promise<string | null> => {
    try {
      setConnectionState('connecting');
      connectToSignalingServer();

      const pc = initializePeerConnection();
      if (!pc) {
        setConnectionState('failed');
        return null;
      }

      // For demo purposes, generate a mock room ID
      const mockRoomId = Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase();
      roomIdRef.current = mockRoomId;

      // TODO: Emit 'create-room' event to the server and handle the response

      return mockRoomId;
    } catch (error) {
      console.error('Error creating room:', error);
      setConnectionState('failed');
      return null;
    }
  }, [connectToSignalingServer, initializePeerConnection]);

  // Join an existing room
  const joinRoom = useCallback(
    async (roomId: string): Promise<boolean> => {
      try {
        setConnectionState('connecting');
        connectToSignalingServer();

        const pc = initializePeerConnection();
        if (!pc) {
          setConnectionState('failed');
          return false;
        }

        roomIdRef.current = roomId;

        // TODO: Emit 'join-room' event to the server and handle the response

        // For demo purposes, simulate a successful connection after a delay
        setTimeout(() => {
          setConnectionState('connected');
        }, 2000);

        return true;
      } catch (error) {
        console.error('Error joining room:', error);
        setConnectionState('failed');
        return false;
      }
    },
    [connectToSignalingServer, initializePeerConnection]
  );

  // Leave the current room
  const leaveRoom = useCallback(async (): Promise<void> => {
    try {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (socketRef.current) {
        // In a real implementation, you would emit a 'leave-room' event
        // socketRef.current.disconnect();
        socketRef.current = null;
      }

      setLocalStream(null);
      setRemoteStream(null);
      setConnectionState('idle');
      setConnectionQuality('unknown');
      roomIdRef.current = null;
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }, []);

  // Add a media stream to the peer connection
  const addStream = useCallback((stream: MediaStream) => {
    if (!peerConnectionRef.current) return;

    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addTrack(track, stream);
      }
    });

    // In a real implementation, after adding tracks, you would create an offer
    // and send it to the peer via the signaling server
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  return {
    connectionState,
    connectionQuality,
    localStream,
    remoteStream,
    createRoom,
    joinRoom,
    leaveRoom,
    addStream,
  };
}
