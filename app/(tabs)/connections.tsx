import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/components/HeaderBar';
import { User, Clock, Video } from 'lucide-react-native';

// Mock data for the connections list
const MOCK_CONNECTIONS = [
  { id: '1', name: 'John Doe', lastConnected: '2 hours ago', status: 'offline' },
  { id: '2', name: 'Jane Smith', lastConnected: '10 minutes ago', status: 'online' },
  { id: '3', name: 'Mike Johnson', lastConnected: 'Just now', status: 'online' },
  { id: '4', name: 'Sarah Williams', lastConnected: '1 day ago', status: 'offline' },
  { id: '5', name: 'Alex Brown', lastConnected: '3 days ago', status: 'offline' },
];

type Connection = {
  id: string;
  name: string;
  lastConnected: string;
  status: 'online' | 'offline';
};

export default function ConnectionsScreen() {
  const [connections] = useState<Connection[]>(MOCK_CONNECTIONS);

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <TouchableOpacity style={styles.connectionItem}>
      <View style={styles.userIconContainer}>
        <User color="#007AFF" size={24} />
      </View>
      
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionName}>{item.name}</Text>
        <View style={styles.connectionMeta}>
          <Clock color="#8E92A4" size={14} style={styles.metaIcon} />
          <Text style={styles.connectionTime}>{item.lastConnected}</Text>
        </View>
      </View>
      
      <View style={styles.connectionActions}>
        <View style={[
          styles.statusIndicator, 
          item.status === 'online' ? styles.statusOnline : styles.statusOffline
        ]} />
        
        <TouchableOpacity 
          style={styles.callButton}
          disabled={item.status !== 'online'}
        >
          <Video 
            color={item.status === 'online' ? '#FFFFFF' : '#B3B3B3'} 
            size={16} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Connections" />
      
      <View style={styles.content}>
        {connections.length > 0 ? (
          <FlatList
            data={connections}
            renderItem={renderConnectionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Connections Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add connections to quickly share your screen with them
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Connection</Text>
        </TouchableOpacity>
      </View>
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
  listContent: {
    paddingBottom: 80,
  },
  connectionItem: {
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
    elevation: 2,
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  connectionName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C2033',
    marginBottom: 4,
  },
  connectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  connectionTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E92A4',
  },
  connectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  statusOnline: {
    backgroundColor: '#34C759',
  },
  statusOffline: {
    backgroundColor: '#8E92A4',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C2033',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4A5073',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});