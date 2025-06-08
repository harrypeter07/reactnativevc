import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import * as ScreenOrientation from 'expo-screen-orientation';

type CaptureStatus = 'idle' | 'capturing' | 'paused' | 'failed';

export function useScreenCapture() {
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Prevent screen capture on native platforms (privacy measure)
    if (Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
    
    // Lock orientation for consistent UI
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    
    return () => {
      // Clean up
      if (Platform.OS !== 'web') {
        ScreenCapture.allowScreenCaptureAsync();
        ScreenOrientation.unlockAsync();
      }
      stopCapture();
    };
  }, []);

  const startCapture = async (): Promise<MediaStream | null> => {
    if (Platform.OS !== 'web') {
      setCaptureStatus('failed');
      console.warn('Screen capture is not supported on this platform');
      return null;
    }
    
    try {
      setCaptureStatus('capturing');
      
      // @ts-ignore - getDisplayMedia exists but isn't in the type definitions
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: false,
      });
      
      setLocalStream(stream);
      
      // Handle user manually stopping the screen share
      stream.getVideoTracks()[0].onended = () => {
        setCaptureStatus('idle');
        setLocalStream(null);
      };
      
      return stream;
    } catch (error) {
      console.error('Error starting screen capture:', error);
      setCaptureStatus('failed');
      return null;
    }
  };

  const stopCapture = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setCaptureStatus('idle');
  };

  const pauseCapture = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.enabled = false;
      });
      setCaptureStatus('paused');
    }
  };

  const resumeCapture = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.enabled = true;
      });
      setCaptureStatus('capturing');
    }
  };

  return {
    captureStatus,
    localStream,
    startCapture,
    stopCapture,
    pauseCapture,
    resumeCapture,
  };
}