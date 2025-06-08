import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/components/HeaderBar';
import { Send } from 'lucide-react-native';

// Mock data for chat messages
const INITIAL_MESSAGES = [
  { id: '1', sender: 'other', text: 'Hi there! Can you share your screen?', timestamp: '10:30 AM' },
  { id: '2', sender: 'me', text: 'Sure, I\'ll start a sharing session now.', timestamp: '10:31 AM' },
  { id: '3', sender: 'other', text: 'Great! What\'s the room code?', timestamp: '10:32 AM' },
  { id: '4', sender: 'me', text: 'The room code is: XYZ123', timestamp: '10:33 AM' },
  { id: '5', sender: 'other', text: 'Thanks, joining now!', timestamp: '10:34 AM' },
];

type Message = {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
};

export default function ChatScreen() {
  const [messages] = useState<Message[]>(INITIAL_MESSAGES);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Chat" />
      
      <View style={styles.content}>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />
        
        <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <Text style={styles.inputPlaceholder}>Type a message...</Text>
          </View>
          
          <TouchableOpacity style={styles.sendButton}>
            <Send color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
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
  messagesList: {
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  myBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1C2033',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E92A4',
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
  },
  inputPlaceholder: {
    color: '#8E92A4',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});