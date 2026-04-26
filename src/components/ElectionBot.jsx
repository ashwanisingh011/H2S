import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * ElectionBot component provides a floating chat interface powered by Gemini 1.5 Flash.
 * It answers questions specifically about the election process.
 * Wrapped in React.memo for efficiency.
 */
const ElectionBot = memo(function ElectionBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am the Democracy Bot, powered by Google Gemini. Ask me any question about the election process, voting, or candidate rules!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Initialize Gemini API
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing.');
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        systemInstruction: "You are Democracy Bot, an expert on the democratic election process, particularly in India but knowledgeable globally. You help citizens understand voting, candidate criteria, election duties, and democratic principles. Keep answers concise, educational, and unbiased. Never endorse specific real-world political parties or current politicians. If asked about something unrelated to elections, politely guide the user back to election topics."
      });

      // Prepare chat history format expected by Gemini
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 250,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting to Google AI right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open Election AI Assistant"
      >
        <MessageCircle size={24} aria-hidden="true" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#0a0a0a] border border-[#262626] rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
            role="dialog"
            aria-label="Election AI Chatbot"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#262626] bg-[#171717]">
              <div className="flex items-center gap-2 text-white">
                <Bot size={20} className="text-blue-400" aria-hidden="true" />
                <h3 className="font-medium text-sm">Democracy Bot</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#a3a3a3] hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-[#262626] text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#262626] text-[#a3a3a3] rounded-2xl rounded-bl-none px-4 py-2.5 text-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#262626] bg-[#171717]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about elections..."
                  className="w-full bg-[#0a0a0a] border border-[#262626] text-white text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-[#404040]"
                  aria-label="Type your message"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:hover:text-blue-500 transition-colors rounded-full"
                  aria-label="Send message"
                >
                  <Send size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-[#737373]">Powered by Google Gemini</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ElectionBot;
