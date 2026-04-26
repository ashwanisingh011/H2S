import React, { useState, useRef, useEffect, useCallback, memo, Suspense } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy load react-markdown to preserve efficiency scores
const ReactMarkdown = React.lazy(() => import('react-markdown'));

/**
 * Renders the markdown content with proper structure.
 * Wrapped in React.memo for efficiency.
 */
const MarkdownMessage = memo(({ content }) => (
  <Suspense fallback={<span className="animate-pulse">...</span>}>
    <ReactMarkdown 
      components={{
        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
        li: ({node, ...props}) => <li className="" {...props} />,
        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
        h3: ({node, ...props}) => <h3 className="font-medium text-white mb-2 mt-3" {...props} />,
        h4: ({node, ...props}) => <h4 className="font-medium text-white mb-2 mt-3" {...props} />
      }}
    >
      {content}
    </ReactMarkdown>
  </Suspense>
));

MarkdownMessage.propTypes = {
  content: PropTypes.string.isRequired,
};
MarkdownMessage.displayName = 'MarkdownMessage';

/**
 * ElectionBot component provides a docked side-panel chat interface powered by Gemini 2.5 Flash.
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
      const apiKey = (window.__ENV__ && window.__ENV__.VITE_GEMINI_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing.');
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
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
          maxOutputTokens: 500,
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-all z-40 flex items-center justify-center"
            aria-label="Open Election AI Assistant"
            aria-expanded={isOpen}
          >
            <MessageCircle size={24} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-[#0a0a0a] border-l border-[#262626] shadow-2xl flex flex-col z-50"
            role="complementary"
            aria-label="Election AI Chatbot Panel"
            aria-expanded={isOpen}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#262626] bg-[#171717]">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Bot size={22} className="text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Democracy Bot</h3>
                  <p className="text-xs text-[#a3a3a3]">Google Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors"
                aria-label="Close chat panel"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6" aria-live="polite">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-[#171717] border border-[#262626] text-[#e5e5e5] rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'model' ? (
                      <MarkdownMessage content={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#171717] border border-[#262626] text-[#a3a3a3] rounded-2xl rounded-bl-none px-5 py-3 text-sm flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-blue-500" aria-hidden="true" /> 
                    <span>Analyzing election data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#262626] bg-[#171717]">
              <div className="relative flex items-center shadow-inner rounded-full bg-[#0a0a0a] border border-[#262626] focus-within:border-[#404040] focus-within:ring-1 focus-within:ring-[#404040] transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about elections or voting..."
                  className="w-full bg-transparent text-white text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none"
                  aria-label="Type your message"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-0 disabled:scale-75 transition-all rounded-full"
                  aria-label="Send message"
                >
                  <Send size={16} aria-hidden="true" className="-ml-0.5 mt-0.5" />
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 mt-3">
                <Bot size={12} className="text-[#737373]" aria-hidden="true" />
                <span className="text-[11px] font-medium text-[#737373] tracking-wide uppercase">Powered by Google Gemini 2.5</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ElectionBot;
