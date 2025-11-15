// file: frontend/src/screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { postChatMessage } from '../api/apiClient';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);

    useEffect(() => {
        setConversationId(uuidv4());
    }, []);

    const handleSendMessage = async () => {
        if (currentMessage.trim().length === 0 || !conversationId) return;
        const newUserMessage = { role: 'user', content: currentMessage.trim() };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setCurrentMessage('');
        setIsLoading(true);
        try {
            const response = await postChatMessage(updatedMessages, conversationId);
            const aiResponseMessage = { role: 'assistant', content: response.data.response };
            setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
        } catch (error) {
            console.error("Lỗi chat:", error.response?.data || error.message);
            const errorMessage = { role: 'assistant', content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            <Text style={styles.header}>Tư Vấn Cùng NutriAI</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
                        <Text style={item.role === 'user' ? styles.userMessageText : styles.assistantMessageText}>
                            {item.content}
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.messageList}
            />
            {isLoading && <ActivityIndicator size="small" color="#191970" style={styles.typingIndicator} />}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={currentMessage}
                    onChangeText={setCurrentMessage}
                    placeholder="Nhập câu hỏi của bạn..."
                    editable={!isLoading}
                />
                <Button title="Gửi" onPress={handleSendMessage} disabled={isLoading} />
            </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color: '#2c3e50',
    },
    messageList: {
        paddingHorizontal: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 15,
        marginVertical: 5,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3498db',
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ecf0f1',
    },
    userMessageText: {
        color: 'white',
        fontSize: 16,
    },
    assistantMessageText: {
        color: 'black',
        fontSize: 16,
    },
    typingIndicator: {
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
});

export default ChatScreen;