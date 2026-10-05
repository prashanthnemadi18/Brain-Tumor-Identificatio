import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../services/api';
import './Chatbot.css';

const SUGGESTIONS = [
  'What tumor types can you detect?',
  'How do I upload an MRI scan?',
  'What does the confidence score mean?',
  'How do I download my report?',
];

// Render **bold** segments and newlines from backend replies.
const renderReply = (text) =>
  text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <React.Fragment key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text:
        "Hi! 👋 I'm NeuroBot, your assistant for the Brain Tumor Identification project. " +
        'Ask me how to analyze an MRI scan, what the results mean, or anything about the project.',
    },
  ]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput('');
    setMessages((m) => [...m, { from: 'user', text: msg }]);
    setTyping(true);
    try {
      const res = await chatbotAPI.send(msg);
      setMessages((m) => [...m, { from: 'bot', text: res.data.reply }]);
    } catch (e) {
      const status = e.response?.status;
      const errText =
        status === 401
          ? 'Your session has expired. Please log in again to keep chatting.'
          : "I'm having trouble connecting right now. Please try again in a moment.";
      setMessages((m) => [...m, { from: 'bot', text: errText }]);
      } finally {
        setTyping(false);
      }
    };

  const handleToggle = () => {
    setOpen((o) => !o);
    setPulse(false);
  };

  return (
    <>
      {!open && (
        <button
          className="chatbot-fab"
          onClick={handleToggle}
          aria-label="Open NeuroBot chat"
          title="Chat with NeuroBot"
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 1-.9 3.8 8.5 8.5 0 1-7.6 4.7 8.38 8.38 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 1-.9-3.8 8.5 8.5 0 1 4.7-7.6 8.38 8.38 0 1 3.8-.9h.5a8.48 8.48 0 1 8v.5z" />
          </svg>
          {pulse && <span className="chatbot-fab__dot" />}
        </button>
      )}

      {open && (
        <div className="chatbot-window">
          <header className="chatbot-header">
            <div className="chatbot-header__avatar">🧠</div>
            <div className="chatbot-header__meta">
              <strong>NeuroBot</strong>
              <span>
                <span className="chatbot-status-dot" /> Online — project assistant
              </span>
            </div>
            <button className="chatbot-close" onClick={handleToggle} aria-label="Close chat">✕</button>
          </header>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${m.from}`}>
                {m.from === 'bot' && <div className="chatbot-msg__avatar">🧠</div>}
                <div className="chatbot-msg__bubble">{renderReply(m.text)}</div>
              </div>
            ))}

            {typing && (
              <div className="chatbot-msg chatbot-msg--bot">
                <div className="chatbot-msg__avatar">🧠</div>
                <div className="chatbot-msg__bubble">
                  <span className="chatbot-typing"><i /><i /><i /></span>
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="chatbot-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chatbot-input"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              autoFocus
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send message">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
