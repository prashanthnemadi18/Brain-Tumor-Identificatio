import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Comprehensive FAQ knowledge base
const KNOWLEDGE_BASE = {
  // Authentication & Login
  'login': {
    keywords: ['log in', 'sign in', 'login', 'authentication', 'access', 'enter'],
    answer: `**How to Log In:**\n\n1. Click the "Login" button on the home page\n2. Enter your registered email address\n3. Enter your password\n4. Click "Sign In"\n\n**Don't have an account?** Click "Register" to create a new account first.\n\n**Forgot password?** Contact support for password reset.`
  },
  'register': {
    keywords: ['register', 'sign up', 'create account', 'new account', 'signup'],
    answer: `**How to Register:**\n\n1. Click "Register" on the login page\n2. Enter your full name\n3. Provide a valid email address\n4. Create a strong password (min. 6 characters)\n5. Click "Register"\n\n**Note:** After registration, you'll be automatically logged in.`
  },
  
  // Dashboard Navigation
  'dashboard': {
    keywords: ['dashboard', 'main page', 'home page', 'navigate', 'menu', 'navigation'],
    answer: `**Dashboard Overview:**\n\nThe dashboard has several sections:\n\n• **Overview** - View your analysis statistics\n• **Tumor Identification** - Upload and analyze MRI scans\n• **Detection History** - View past predictions\n• **Analytics** - Detailed statistics and charts\n• **Profile** - Update your account information\n• **Settings** - Manage preferences\n\n**Tip:** Use the sidebar menu to navigate between sections.`
  },
  
  // Upload & Analysis
  'upload': {
    keywords: ['upload', 'image', 'file', 'mri', 'scan', 'picture', 'photo'],
    answer: `**How to Upload an MRI Image:**\n\n1. Go to "Tumor Identification" in the sidebar\n2. Click "Browse Files" or drag & drop your image\n3. **OR** click "Capture from Camera" for real-time capture\n4. Supported formats: JPG, PNG, JPEG, WEBP\n5. Click "Analyze Image" to start prediction\n\n**Important:** Only upload grayscale brain MRI scans. Other images will be rejected.`
  },
  'analyze': {
    keywords: ['analyze', 'prediction', 'detect', 'start', 'process', 'scan'],
    answer: `**How to Analyze an Image:**\n\n1. Upload an MRI scan (see upload instructions)\n2. Wait for image validation (automatic)\n3. Click "Analyze Image" button\n4. Wait 3-5 seconds for AI processing\n5. View results with confidence scores\n\n**The system detects:**\n• Glioma\n• Meningioma\n• Pituitary Tumor\n• No Tumor`
  },
  'camera': {
    keywords: ['camera', 'webcam', 'capture', 'real-time', 'live'],
    answer: `**Using Camera Capture:**\n\n1. Click "Capture from Camera" button\n2. Allow browser camera permissions\n3. Position MRI image in front of camera\n4. Click "Capture Image" when ready\n5. Review captured image\n6. Click "Analyze Image" to proceed\n\n**Tip:** Ensure good lighting for best capture quality.`
  },
  
  // Results & Reports
  'results': {
    keywords: ['results', 'prediction', 'outcome', 'diagnosis', 'confidence'],
    answer: `**Understanding Your Results:**\n\n**Predicted Class:** The type of tumor detected (or "No Tumor")\n\n**Confidence Score:** How confident the AI is (0-100%)\n- 90-100%: High confidence\n- 70-89%: Good confidence\n- Below 70%: Lower confidence\n\n**Class Probabilities:** Detailed breakdown of all classes\n\n**Medical Guidance:** Recommendations based on the result\n\n**⚠️ Important:** This is AI-assisted analysis. Always consult a medical professional.`
  },
  'download': {
    keywords: ['download', 'report', 'pdf', 'save', 'export'],
    answer: `**How to Download Report:**\n\n**After Analysis:**\n1. View your prediction result\n2. Click "Download Report" button\n3. PDF will download automatically\n\n**From History:**\n1. Go to "Detection History"\n2. Click "View" on any past analysis\n3. Click "Download Report" in the modal\n\n**Report Contains:**\n• Analysis ID and timestamp\n• Predicted class and confidence\n• All class probabilities\n• Medical disclaimer\n• Tumor information`
  },
  
  // History & Analytics
  'history': {
    keywords: ['history', 'past', 'previous', 'old', 'records', 'archive'],
    answer: `**Viewing Detection History:**\n\n1. Click "Detection History" in sidebar\n2. View all your past analyses in a table\n3. Use filters to search:\n   • By date (7/30/90 days)\n   • By result type (Tumor/Clear)\n   • By category (Glioma/Meningioma/etc.)\n4. Click "View" to see full details\n5. Download individual reports\n\n**Pagination:** Use arrow buttons to navigate pages`
  },
  'analytics': {
    keywords: ['analytics', 'statistics', 'stats', 'graphs', 'charts'],
    answer: `**Analytics Dashboard:**\n\nView comprehensive statistics:\n\n• **Total Predictions:** Count of all analyses\n• **Class Distribution:** Breakdown by tumor type\n• **Trend Charts:** Analysis over time\n• **Average Confidence:** Overall accuracy\n\n**Access:** Click "Analytics" in the sidebar`
  },
  
  // Profile & Settings
  'profile': {
    keywords: ['profile', 'account', 'personal', 'information', 'update'],
    answer: `**Managing Your Profile:**\n\n1. Click "Profile" in the sidebar\n2. View your current information\n3. Click "Edit Profile" to update:\n   • Name\n   • Email\n   • Password\n4. Click "Save Changes"\n\n**Note:** Email changes may require verification.`
  },
  'settings': {
    keywords: ['settings', 'preferences', 'configuration', 'theme'],
    answer: `**Settings Options:**\n\n1. Click "Settings" in sidebar\n2. Available options:\n   • **Theme:** Switch between Light/Dark mode\n   • **Notifications:** Enable/disable alerts\n   • **Language:** Select preferred language\n   • **Privacy:** Manage data preferences\n\n3. Changes save automatically`
  },
  
  // Errors & Troubleshooting
  'error': {
    keywords: ['error', 'problem', 'issue', 'not working', 'failed', 'bug'],
    answer: `**Common Issues & Solutions:**\n\n**Upload Failed:**\n• Ensure image is a brain MRI scan\n• Check file format (JPG, PNG, JPEG, WEBP)\n• File size should be under 10MB\n\n**Analysis Failed:**\n• Check internet connection\n• Try uploading a different image\n• Refresh the page and try again\n\n**Login Issues:**\n• Verify email and password\n• Clear browser cache\n• Try incognito/private mode\n\n**Still having issues?** Contact support with error details.`
  },
  'invalid': {
    keywords: ['invalid', 'rejected', 'not accepted', 'wrong image'],
    answer: `**Image Validation Failed:**\n\nYour image was rejected because:\n\n**Possible Reasons:**\n• Not a medical brain scan\n• Image contains faces/text\n• Colorful photo instead of MRI\n• Document or certificate\n\n**Solution:**\n1. Upload a grayscale brain MRI scan\n2. Ensure no text overlays\n3. Use medical imaging only\n\n**What to Upload:** T1/T2-weighted MRI scans of the brain`
  },
  
  // System Information
  'tumor': {
    keywords: ['tumor', 'types', 'categories', 'classes', 'detect'],
    answer: `**Tumor Types We Detect:**\n\n**1. Glioma**\n• Originates in glial cells\n• Most common primary brain tumor\n• Various grades of aggressiveness\n\n**2. Meningioma**\n• Arises from meninges (brain membranes)\n• Usually slow-growing\n• Often benign\n\n**3. Pituitary Tumor**\n• Develops in pituitary gland\n• Affects hormone production\n• Most are benign adenomas\n\n**4. No Tumor**\n• Normal brain MRI\n• No tumor patterns detected`
  },
  'accuracy': {
    keywords: ['accuracy', 'reliable', 'trust', 'confidence', 'correct'],
    answer: `**System Accuracy:**\n\n**Model Performance:**\n• Training Accuracy: ~95%\n• Uses CNN deep learning\n• Trained on 7,200+ MRI images\n• Multiple validation checks\n\n**Confidence Scores:**\n• High (90-100%): Very reliable\n• Good (70-89%): Reliable\n• Lower (<70%): Needs review\n\n**⚠️ IMPORTANT:** This is AI-assisted analysis, not a medical diagnosis. Always consult qualified medical professionals for diagnosis and treatment decisions.`
  },
  
  // Logout
  'logout': {
    keywords: ['logout', 'log out', 'sign out', 'exit', 'leave'],
    answer: `**How to Log Out:**\n\n1. Look at the bottom of the sidebar\n2. Click the red "Logout" button\n3. You'll be redirected to the home page\n4. Your session will be cleared\n\n**Security Tip:** Always log out when using shared computers.`
  },
  
  // Getting Started
  'start': {
    keywords: ['start', 'begin', 'getting started', 'how to use', 'tutorial', 'guide'],
    answer: `**Complete Process Guide:**\n\n**Step 1:** Register/Login\n• Create account or sign in\n\n**Step 2:** Navigate to Dashboard\n• Click "Tumor Identification"\n\n**Step 3:** Upload MRI Scan\n• Browse files or use camera\n• Wait for validation\n\n**Step 4:** Analyze Image\n• Click "Analyze Image"\n• Wait 3-5 seconds\n\n**Step 5:** View Results\n• Check confidence score\n• Read interpretation\n\n**Step 6:** Download Report\n• Click "Download Report"\n• Save PDF for records\n\n**Step 7:** View History (Optional)\n• Access past analyses\n• Track your records\n\n**Ready to start?** Ask me about any specific step!`
  }
};

// Quick action buttons
const QUICK_ACTIONS = [
  { label: '🔐 How to login?', query: 'How do I log in?' },
  { label: '📤 Upload image', query: 'How do I upload an MRI image?' },
  { label: '📊 View results', query: 'How do I view my results?' },
  { label: '📥 Download report', query: 'How do I download a report?' },
  { label: '❌ Log out', query: 'How do I log out?' },
];

// Find best matching answer
const findAnswer = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Check each knowledge base entry
  for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => message.includes(keyword))) {
      return data.answer;
    }
  }
  
  // Default response if no match
  return `I'm here to help! I can answer questions about:\n\n• **Login & Registration**\n• **Dashboard Navigation**\n• **Uploading & Analyzing Images**\n• **Understanding Results**\n• **Downloading Reports**\n• **Viewing History**\n• **Profile & Settings**\n• **Troubleshooting Errors**\n• **System Information**\n• **Logout Process**\n\nTry asking something like:\n• "How do I upload an image?"\n• "What do the results mean?"\n• "How to download a report?"\n• "How do I log out?"`;
};

// Render **bold** segments and newlines
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
        "Hi! 👋 I'm **NeuroBot**, your personal guide for the Brain Tumor Detection System.\n\n" +
        "I can help you with:\n" +
        "• Logging in and getting started\n" +
        "• Uploading and analyzing MRI scans\n" +
        "• Understanding your results\n" +
        "• Downloading reports\n" +
        "• Any questions or issues you have\n\n" +
        "**How can I help you today?**"
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
    
    // Simulate typing delay for better UX
    setTimeout(() => {
      const answer = findAnswer(msg);
      setMessages((m) => [...m, { from: 'bot', text: answer }]);
      setTyping(false);
    }, 800);
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
          title="Chat with NeuroBot - Get Help"
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
                <span className="chatbot-status-dot" /> Online — Ready to help!
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

            {messages.length <= 1 && !typing && (
              <div className="chatbot-quick-actions">
                {QUICK_ACTIONS.map((action) => (
                  <button 
                    key={action.label} 
                    className="chatbot-quick-action"
                    onClick={() => send(action.query)}
                  >
                    {action.label}
                  </button>
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
