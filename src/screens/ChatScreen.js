// file: frontend/src/screens/ChatScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { postChatMessage } from '../api/apiClient';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim().length === 0) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [userMessage, ...prev]);
    setInput('');
    setIsLoading(true);

    try {
        const response = await postChatMessage("test_user_123", input);
        const aiMessage = { id: (Date.now() + 1).toString(), text: response.data.response, sender: 'ai' };
        setMessages(prev => [aiMessage, ...prev]);
    } catch (error) {
        console.error("Lỗi chat:", error);
        const errorMessage = { id: (Date.now() + 1).toString(), text: "Xin lỗi, có lỗi xảy ra.", sender: 'ai' };
        setMessages(prev => [errorMessage, ...prev]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={{ padding: 10 }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Hỏi NutriAI điều gì đó..."
          />
          <Button title="Gửi" onPress={handleSend} disabled={isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
    input: { flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
    messageContainer: { maxWidth: '80%', padding: 12, borderRadius: 18, marginBottom: 10 },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#1e88e5' },
    aiMessage: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
    userText: { color: 'white' },
    aiText: { color: 'black' },
});

export default ChatScreen;