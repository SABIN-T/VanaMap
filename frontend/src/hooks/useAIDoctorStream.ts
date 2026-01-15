import { useEffect, useRef, useState, useCallback } from 'react';
import { API_URL } from '../services/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    image?: string;
}

interface ChatStreamOptions {
    messages: Message[];
    userContext?: any;
    image?: string | null;
    persona?: string;
    onChunk?: (chunk: string) => void;
    onComplete?: (fullMessage: string) => void;
    onError?: (error: string) => void;
}

export const useAIDoctorStream = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const reconnectTimeoutRef = useRef<number | undefined>(undefined);

    // Get WebSocket URL from API_URL
    const getWsUrl = useCallback(() => {
        const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
        const baseUrl = API_URL.replace(/^https?:\/\//, '');
        const token = localStorage.getItem('token');
        return `${wsProtocol}://${baseUrl}/ws/chat${token ? `?token=${token}` : ''}`;
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return; // Already connected
        }

        try {
            const ws = new WebSocket(getWsUrl());

            ws.onopen = () => {
                console.log('[WS] Connected to AI Doctor');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('[WS] Received:', data.type);

                    // Handle different message types
                    if (data.type === 'connected') {
                        console.log('[WS]', data.message);
                    }
                } catch (e) {
                    console.error('[WS] Failed to parse message:', e);
                }
            };

            ws.onclose = () => {
                console.log('[WS] Disconnected');
                setIsConnected(false);
                setIsStreaming(false);

                // Auto-reconnect after 3 seconds
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    console.log('[WS] Attempting to reconnect...');
                    connect();
                }, 3000) as unknown as number;
            };

            ws.onerror = (error) => {
                console.error('[WS] Error:', error);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('[WS] Connection failed:', error);
        }
    }, [getWsUrl]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((options: ChatStreamOptions) => {
        const ws = wsRef.current;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            options.onError?.('WebSocket not connected');
            return;
        }

        setIsStreaming(true);
        let fullMessage = '';

        // Set up one-time message handler for this stream
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'status':
                        // AI is thinking
                        break;

                    case 'stream_start':
                        fullMessage = '';
                        break;

                    case 'chunk':
                        fullMessage += data.content;
                        options.onChunk?.(data.content);
                        break;

                    case 'stream_end':
                        setIsStreaming(false);
                        options.onComplete?.(fullMessage);
                        ws.removeEventListener('message', handleMessage);
                        break;

                    case 'error':
                        setIsStreaming(false);
                        options.onError?.(data.error);
                        ws.removeEventListener('message', handleMessage);
                        break;
                }
            } catch (e) {
                console.error('[WS] Message handling error:', e);
            }
        };

        ws.addEventListener('message', handleMessage);

        // Send the chat request
        ws.send(JSON.stringify({
            type: 'chat',
            data: {
                messages: options.messages,
                userContext: options.userContext,
                image: options.image,
                persona: options.persona || 'flora'
            }
        }));
    }, []);

    // Connect on mount
    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        isConnected,
        isStreaming,
        sendMessage,
        connect,
        disconnect
    };
};
