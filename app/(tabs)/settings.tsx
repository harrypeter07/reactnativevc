import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/components/HeaderBar';
import { 
  Bell, 
  Camera, 
  Wifi, 
  Monitor, 
  Lock, 
  HelpCircle, 
  LogOut, 
  ChevronRight 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoAcceptInvites, setAutoAcceptInvites] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Settings" />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Receive alerts for new connections and invites</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E5EA', true: '#B3D4FF' }}
              thumbColor={notifications ? '#007AFF' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Camera color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto-accept invites</Text>
              <Text style={styles.settingDescription}>Automatically accept screen sharing invites</Text>
            </View>
            <Switch
              value={autoAcceptInvites}
              onValueChange={setAutoAcceptInvites}
              trackColor={{ false: '#E5E5EA', true: '#B3D4FF' }}
              thumbColor={autoAcceptInvites ? '#007AFF' : '#FFFFFF'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Wifi color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>High quality mode</Text>
              <Text style={styles.settingDescription}>Use more data for better quality</Text>
            </View>
            <Switch
              value={highQuality}
              onValueChange={setHighQuality}
              trackColor={{ false: '#E5E5EA', true: '#B3D4FF' }}
              thumbColor={highQuality ? '#007AFF' : '#FFFFFF'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Monitor color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Screen capture settings</Text>
              <Text style={styles.settingDescription}>Configure screen capture preferences</Text>
            </View>
            <ChevronRight color="#8E92A4" size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Save sharing history</Text>
              <Text style={styles.settingDescription}>Store records of screen sharing sessions</Text>
            </View>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ false: '#E5E5EA', true: '#B3D4FF' }}
              thumbColor={saveHistory ? '#007AFF' : '#FFFFFF'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <HelpCircle color="#007AFF" size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help using the app</Text>
            </View>
            <ChevronRight color="#8E92A4" size={20} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut color="#FF3B30" size={20} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#8E92A4',
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C2033',
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E92A4',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FF3B30',
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E92A4',
    textAlign: 'center',
    marginBottom: 32,
  },
});