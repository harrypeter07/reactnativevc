declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SIGNALING_SERVER_URL: string;
      // Add other environment variables here
    }
  }
}

// Ensure this file is treated as a module
export {};