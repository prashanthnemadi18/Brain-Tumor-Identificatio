import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Site Header */}
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <span className="site-header__logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V19a2 2 0 0 0 4 0V5a1 1 0 0 0-1-1H9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="site-header__title">AI-Based Brain Tumor Identification System</span>
          </div>
          <button className="site-header__login" onClick={() => navigate('/login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Healthcare Solution</div>
          <h1 className="hero-title">Brain Tumor Detection & Classification</h1>
          <p className="hero-subtitle">
            Advanced Deep Learning Technology for Medical Image Analysis
          </p>
          <div className="hero-buttons">
            <button className="btn btn-hero-primary" onClick={() => navigate('/login')}>
              <span className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                </svg>
              </span>
              Get Started
            </button>
            <button className="btn btn-hero-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
          <p className="hero-disclaimer">
            AI-assisted analysis for research and preliminary screening. This system does not
            replace professional medical diagnosis.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 8V24L32 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-value">5-10 sec</div>
              <div className="stat-label">Analysis Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="6" y="12" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 20L20 24L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-value">95%+</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="16" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="8" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-value">4 Types</div>
              <div className="stat-label">Tumor Classification</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L6 14V26C6 36 14 44 24 44C34 44 42 36 42 26V14L24 4Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 24L22 28L30 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-value">Secure</div>
              <div className="stat-label">HIPAA Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">About the System</div>
            <h2 className="section-title">Advanced AI-Powered Diagnostic Platform</h2>
            <p className="section-description">
              Our cutting-edge system utilizes state-of-the-art Convolutional Neural Networks 
              to analyze MRI brain scans with unprecedented accuracy and speed.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Core Features</div>
            <h2 className="section-title">Comprehensive Diagnostic Suite</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="6" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12H24M8 16H24M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Deep Learning Analysis</h3>
              <p>Advanced CNN architecture trained on thousands of medical images for precise tumor detection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Real-Time Processing</h3>
              <p>Instant analysis with results delivered in seconds, not hours</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 16L12 24L28 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Multi-Class Detection</h3>
              <p>Identifies Glioma, Meningioma, Pituitary tumors, and healthy tissue</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 12H22M10 16H22M10 20H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Detailed Reports</h3>
              <p>Comprehensive PDF reports with analysis, metrics, and recommendations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 28C8 22 11 20 16 20C21 20 24 22 24 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Secure Platform</h3>
              <p>Enterprise-grade security with encrypted data storage and transmission</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 12H28" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="18" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>History Tracking</h3>
              <p>Complete analysis history with easy access to past diagnoses</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Process</div>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="process-number">01</div>
              <div className="process-content">
                <h3>Upload MRI Scan</h3>
                <p>Securely upload your brain MRI image through our intuitive interface</p>
              </div>
            </div>
            <div className="process-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20H30M30 20L22 12M30 20L22 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="process-step">
              <div className="process-number">02</div>
              <div className="process-content">
                <h3>AI Analysis</h3>
                <p>Our CNN model processes and analyzes the image using advanced algorithms</p>
              </div>
            </div>
            <div className="process-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20H30M30 20L22 12M30 20L22 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="process-step">
              <div className="process-number">03</div>
              <div className="process-content">
                <h3>Get Results</h3>
                <p>Receive detailed analysis with classification and confidence scores</p>
              </div>
            </div>
            <div className="process-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20H30M30 20L22 12M30 20L22 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="process-step">
              <div className="process-number">04</div>
              <div className="process-content">
                <h3>Download Report</h3>
                <p>Access comprehensive PDF reports for medical records</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Advanced AI Diagnostics?</h2>
            <p>Join healthcare professionals worldwide using our platform for accurate brain tumor detection</p>
            <button className="btn btn-cta" onClick={() => navigate('/login')}>
              <span className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                </svg>
              </span>
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">About This Project</h2>
          <p className="section-text">
            This advanced system leverages Convolutional Neural Networks (CNN) and deep learning 
            techniques to analyze MRI brain images and identify the presence and type of brain tumors. 
            Our AI-powered solution aims to assist healthcare professionals in making faster and more 
            accurate diagnoses.
          </p>
        </div>
      </section>

      {/* What is Brain Tumor Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">What is a Brain Tumor?</h2>
          <p className="section-text">
            A brain tumor is an abnormal growth of cells in the brain. Tumors can be benign (non-cancerous) 
            or malignant (cancerous). They can originate in the brain (primary tumors) or spread from other 
            parts of the body (secondary tumors). Early detection is crucial for effective treatment planning 
            and improved patient outcomes.
          </p>
          <div className="info-grid">
            <div className="info-card">
              <h3>Glioma</h3>
              <p>Tumors that originate in glial cells, representing about 33% of all brain tumors.</p>
            </div>
            <div className="info-card">
              <h3>Meningioma</h3>
              <p>Most common primary brain tumor, arising from the meninges surrounding the brain.</p>
            </div>
            <div className="info-card">
              <h3>Pituitary Tumor</h3>
              <p>Tumors in the pituitary gland that can affect hormone production and regulation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Importance of Early Detection</h2>
          <ul className="feature-list">
            <li>Enables timely medical intervention and treatment planning</li>
            <li>Improves patient survival rates and quality of life</li>
            <li>Allows for less invasive treatment options when detected early</li>
            <li>Reduces healthcare costs through early intervention</li>
            <li>Provides better prognosis for patients</li>
          </ul>
        </div>
      </section>

      {/* Project Objectives Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Project Objectives</h2>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="objective-number">1</div>
              <p>Develop an automated system for detecting brain tumors from MRI images</p>
            </div>
            <div className="objective-card">
              <div className="objective-number">2</div>
              <p>Classify different types of brain tumors using deep learning models</p>
            </div>
            <div className="objective-card">
              <div className="objective-number">3</div>
              <p>Improve speed and consistency of MRI image analysis</p>
            </div>
            <div className="objective-card">
              <div className="objective-number">4</div>
              <p>Reduce potential human error in image-based analysis</p>
            </div>
            <div className="objective-card">
              <div className="objective-number">5</div>
              <p>Enhance feature extraction from MRI images using CNNs</p>
            </div>
            <div className="objective-card">
              <div className="objective-number">6</div>
              <p>Provide user-friendly interface for healthcare professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Advantages of the Proposed System</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Speed</h3>
              <p>Automated analysis provides results in seconds compared to manual examination</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16L14 22L24 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Consistency</h3>
              <p>AI provides consistent results without variation between observations</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="13" y="4" width="6" height="20" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="22" y="10" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Scalability</h3>
              <p>Can process large volumes of MRI scans efficiently</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="6" fill="currentColor"/>
                  <circle cx="16" cy="8" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Accuracy</h3>
              <p>High accuracy rates with continuous model improvement</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 4V16M16 16L10 10M16 16L22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Accessibility</h3>
              <p>Web-based interface accessible from anywhere</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 10H22M10 14H22M10 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Documentation</h3>
              <p>Automatic generation of comprehensive analysis reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Limitations of Traditional Methods</h2>
          <div className="limitations-grid">
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V16L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p>Time-consuming manual analysis</p>
            </div>
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="2" fill="currentColor"/>
                </svg>
              </div>
              <p>Subjective interpretation</p>
            </div>
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="13" y="12" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="22" y="6" width="6" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <p>Variation between observers</p>
            </div>
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 10H18M10 14H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="12" y="8" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="white"/>
                  <path d="M16 12H22M16 16H22M16 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p>Difficulty handling large volumes</p>
            </div>
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 10L22 22M22 10L10 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p>Potential for human error</p>
            </div>
            <div className="limitation-item">
              <div className="limitation-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L18 12H26L20 17L22 25L16 20L10 25L12 17L6 12H14L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p>Dependence on specialist expertise</p>
            </div>
          </div>
        </div>
      </section>



      {/* Additional CTA Section */}
      <section className="section">
        <div className="container">
          <div className="cta-content-bottom">
            <h2>Ready to Get Started?</h2>
            <p>Create an account and start analyzing MRI images today</p>
            <button className="btn btn-cta" onClick={() => navigate('/login')}>
              Login / Register
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
