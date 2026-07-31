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

const SUGGESTED_QUESTIONS = [
  '¿Cómo pido un aumento basado en mi score?',
  '¿Debería buscar otro trabajo o negociar aquí?',
  '¿Qué skills debería desarrollar para subir?',
  'Dame argumentos para mi revisión salarial',
  '¿Cuánto debería cobrar como freelancer?',
  '¿Cómo aumento mi influencia/liderazgo?',
];

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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setLoading(true);

    try {
      const response = await chatWithClaude(message, analysisData);

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
        content: '❌ Disculpa, hubo un error. Intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '700px',
      backgroundColor: '#1a1a2e',
      border: '2px solid #16213e',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 32px rgba(0, 208, 132, 0.1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #16213e',
        backgroundColor: '#0f3460',
      }}>
        <h3 style={{
          margin: '0',
          color: '#00d084',
          fontSize: '16px',
          fontWeight: '600',
        }}>
          🤖 Consultor IA
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          color: '#666',
          fontSize: '12px',
        }}>
          Powered by Claude
        </p>
      </div>

      {/* Messages Container */}
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
              animation: 'fadeIn 0.3s ease-in',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: msg.role === 'user' ? '#00d084' : '#16213e',
                color: msg.role === 'user' ? '#1a1a2e' : '#e0e0e0',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                fontSize: '14px',
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
              borderRadius: '18px',
              backgroundColor: '#16213e',
              color: '#00d084',
              fontSize: '14px',
            }}>
              ⏳ Pensando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && messages.length === 1 && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #16213e',
          borderBottom: '1px solid #16213e',
          backgroundColor: '#0f3460',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          <p style={{
            margin: '0 0 12px 0',
            color: '#aaa',
            fontSize: '12px',
            fontWeight: '500',
          }}>
            Preguntas sugeridas:
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                disabled={loading}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#16213e',
                  border: '1px solid #00d084',
                  borderRadius: '8px',
                  color: '#00d084',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#00d084';
                    e.currentTarget.style.color = '#1a1a2e';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#16213e';
                    e.currentTarget.style.color = '#00d084';
                  }
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px',
          backgroundColor: '#0f3460',
          borderTop: '1px solid #16213e',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta algo sobre tu análisis..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #16213e',
            backgroundColor: '#1a1a2e',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s',
            opacity: loading ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00d084';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#16213e';
          }}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: loading || !inputValue.trim() ? '#555' : '#00d084',
            color: '#1a1a2e',
            fontWeight: 'bold',
            cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (!loading && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = '#00c070';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = '#00d084';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
