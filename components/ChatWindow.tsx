'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithClaude, AnalysisData } from '@/lib/chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  analysisData: AnalysisData;
}

export default function ChatWindow({ analysisData }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hola 👋 Soy tu consultor salarial de Codify. Vi tu análisis y estoy listo para ayudarte. 

Puedo:
✓ Ayudarte a preparar una negociación salarial
✓ Sugerir skills a desarrollar
✓ Analizar oportunidades de crecimiento
✓ Dar argumentos basados en tu score

¿Con qué te puedo ayudar?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatWithClaude(inputValue, analysisData);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Disculpa, hubo un error. Intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      backgroundColor: '#1a1a2e',
      border: '1px solid #16213e',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#00d084' : '#16213e',
                color: msg.role === 'user' ? '#1a1a2e' : '#ffffff',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#16213e',
              color: '#00d084',
            }}>
              Pensando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px',
          borderTop: '1px solid #16213e',
          backgroundColor: '#0f3460',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta algo sobre tu salario o carrera..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #16213e',
            backgroundColor: '#1a1a2e',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: loading ? '#666' : '#00d084',
            color: '#1a1a2e',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
