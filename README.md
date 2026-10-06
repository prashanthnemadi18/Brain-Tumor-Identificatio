# 🧠 Brain Tumor Identification and Classification Using Deep Learning

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0%2B-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-000000.svg)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00.svg)](https://www.tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Project Overview

An advanced **AI-powered medical imaging system** that analyzes brain MRI scans using **Convolutional Neural Networks (CNN)** and deep learning to detect and classify brain tumors with high accuracy. This full-stack application provides healthcare professionals with a fast, reliable, and user-friendly platform for preliminary brain tumor screening.

### 🎯 Key Highlights
- **95%+ Accuracy** - High-precision CNN model trained on 7,200+ MRI images
- **5-10 Second Analysis** - Real-time predictions with instant results
- **4 Tumor Classifications** - Glioma, Meningioma, Pituitary Tumor, No Tumor
- **Complete Web Platform** - Full-stack application with React frontend and Flask backend
- **AI Assistant (NeuroBot)** - Integrated chatbot for user guidance
- **Professional Reports** - Automated PDF report generation
- **Secure & Private** - JWT authentication with encrypted data storage

## 🚀 Live Demo

> **Note**: This is a demonstration project. Screenshots and demo video available in `/docs` folder.

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/homepage.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Analysis Results
![Results](docs/screenshots/results.png)

### NeuroBot Assistant
![Chatbot](docs/screenshots/chatbot.png)

## 🛠️ Technology Stack

### **Frontend**
- ⚛️ **React.js 18** - Component-based UI framework
- 🎨 **CSS3** - Modern styling with animations
- 📡 **Axios** - HTTP client for API calls
- 🧭 **React Router** - Client-side routing
- 📱 **Responsive Design** - Mobile-friendly interface

### **Backend**
- 🐍 **Python 3.11** - Core backend language
- 🌶️ **Flask 3.0** - Lightweight web framework
- 🔐 **JWT** - JSON Web Token authentication
- 📄 **ReportLab** - PDF report generation
- 🖼️ **Pillow** - Image processing

### **Deep Learning & AI**
- 🤖 **TensorFlow 2.x** - Deep learning framework
- 🧠 **Keras** - High-level neural network API
- 🏗️ **EfficientNet** - CNN architecture
- 📊 **NumPy & Pandas** - Data manipulation
- 🎯 **Scikit-learn** - ML utilities
- 👁️ **OpenCV** - Computer vision

### **Database**
- 🍃 **MongoDB 6.0** - NoSQL database
- 📦 **PyMongo** - MongoDB Python driver

### **Additional Tools**
- 🤖 **NeuroBot** - Intelligent chatbot assistant
- 📊 **Analytics Dashboard** - Comprehensive statistics
- 📥 **PDF Reports** - Professional documentation
- 📷 **Camera Capture** - Real-time image capture

## Project Structure
```
Brain Tumor Identification/
├── frontend/                  # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/                   # Python Flask backend
│   ├── models/               # CNN models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── config/               # Configuration
│   ├── app.py               # Main application
│   └── requirements.txt
├── ml_module/                # Deep learning module
│   ├── train_model.py       # Model training
│   ├── preprocessing.py     # Image preprocessing
│   ├── model_architectures.py
│   └── evaluate.py
├── archive/                  # Dataset
│   ├── Training/
│   └── Testing/
└── README.md
```

## ✨ Features

### 🔐 **Authentication & Security**
- ✅ Secure user registration and login
- ✅ JWT-based authentication
- ✅ Password encryption
- ✅ Protected routes
- ✅ Session management

### 📤 **Image Upload & Processing**
- ✅ Drag-and-drop file upload
- ✅ Real-time camera capture
- ✅ Multiple format support (JPG, PNG, JPEG, WEBP)
- ✅ Automatic image validation
- ✅ Preprocessing and normalization
- ✅ Image preview before analysis

### 🧠 **AI-Powered Analysis**
- ✅ EfficientNet-based CNN model
- ✅ 4-class classification (Glioma, Meningioma, Pituitary, No Tumor)
- ✅ Confidence score calculation
- ✅ Class probability distribution
- ✅ 5-10 second processing time
- ✅ High accuracy predictions (95%+)

### 📊 **Results & Reporting**
- ✅ Detailed prediction results
- ✅ Confidence score visualization
- ✅ Medical interpretation guidance
- ✅ Professional PDF report generation
- ✅ Download reports for records
- ✅ Historical analysis tracking

### 📈 **Dashboard & Analytics**
- ✅ Overview statistics
- ✅ Analysis history with filters
- ✅ Trend charts and graphs
- ✅ Class distribution insights
- ✅ Search and pagination
- ✅ Export functionality

### 🤖 **NeuroBot Assistant**
- ✅ 24/7 intelligent chatbot
- ✅ 50+ pre-programmed responses
- ✅ Step-by-step guidance
- ✅ Troubleshooting help
- ✅ Quick action buttons
- ✅ Natural language understanding

### 👤 **User Management**
- ✅ Profile management
- ✅ Settings customization
- ✅ Theme options (Light/Dark)
- ✅ Account preferences
- ✅ Data privacy controls

## 📦 Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v14.0+ | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.8+ | [python.org](https://www.python.org/) |
| **MongoDB** | 6.0+ | [mongodb.com](https://www.mongodb.com/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### 🔧 Quick Start

#### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/prashanthnemadi18/Brain-Tumor-Identificatio.git
cd Brain-Tumor-Identificatio
```

#### 2️⃣ **Setup MongoDB**

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Create database (run in MongoDB shell)
use brain_tumor_db
```

**Linux/Mac:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Create database
mongosh
use brain_tumor_db
```

#### 3️⃣ **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Configure .env with your settings
# MONGO_URI=mongodb://localhost:27017/brain_tumor_db
# JWT_SECRET_KEY=your-secret-key-here
# FLASK_ENV=development
```

#### 4️⃣ **Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

#### 5️⃣ **Start the Application**

**Option A: Manual Start**

```bash
# Terminal 1 - Start Backend
cd backend
python app.py

# Terminal 2 - Start Frontend
cd frontend
npm start
```

**Option B: Using Batch Files (Windows)**

```bash
# Double-click START_APP.bat in the root directory
# Or run from command line:
START_APP.bat
```

#### 6️⃣ **Access the Application**

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 📊 **MongoDB**: mongodb://localhost:27017

### 🎯 Initial Setup Complete!

Default credentials for testing:
- **Email**: demo@example.com
- **Password**: demo123

> **Note**: Change these credentials immediately in production!

## 📖 Usage Guide

### 🏠 **Step 1: Home Page**
- View project information and features
- Learn about brain tumor types
- Read about the AI technology
- Click "Get Started" or "Login"

### 🔐 **Step 2: Login / Register**
- Create a new account with email and password
- Or login with existing credentials
- Get help from NeuroBot if needed

### 📊 **Step 3: Dashboard**
- Navigate through sidebar menu
- View overview statistics
- Access different sections

### 📤 **Step 4: Upload MRI Image**
- Go to "Tumor Identification" section
- Click "Browse Files" or drag & drop image
- OR use "Capture from Camera" for real-time capture
- Wait for automatic validation

### 🔍 **Step 5: Analyze Image**
- Review uploaded image
- Click "Analyze Image" button
- Wait 5-10 seconds for AI processing
- View results with confidence scores

### 📄 **Step 6: View Results**
- See predicted tumor class
- Check confidence percentage
- Read medical interpretation
- View class probability distribution

### 📥 **Step 7: Download Report**
- Click "Download Report" button
- Get comprehensive PDF with:
  - Analysis details
  - Confidence scores
  - Medical guidance
  - Timestamp and ID

### 📜 **Step 8: View History**
- Access "Detection History" section
- Filter by date, result type, category
- View past analyses
- Re-download old reports

### 💬 **Step 9: Get Help Anytime**
- Click NeuroBot (purple button, bottom-left)
- Ask questions about any feature
- Get instant step-by-step guidance

### 🚪 **Step 10: Logout**
- Click "Logout" button in sidebar
- Session cleared securely

## 🎯 Model Performance

### CNN Model Architecture
- **Base Model**: EfficientNet
- **Training Dataset**: 7,200+ MRI images
- **Testing Dataset**: 1,600+ MRI images
- **Input Size**: 224x224 pixels
- **Classes**: 4 (Glioma, Meningioma, Pituitary, No Tumor)

### Performance Metrics

| Metric | Score |
|--------|-------|
| **Training Accuracy** | ~95% |
| **Validation Accuracy** | ~93% |
| **Precision** | 0.94 |
| **Recall** | 0.93 |
| **F1-Score** | 0.93 |

### Evaluation Methods
- ✅ Confusion Matrix Analysis
- ✅ ROC Curve & AUC Score
- ✅ Precision-Recall Curves
- ✅ Cross-validation
- ✅ Real-world testing

### Training Details
```python
# Model training parameters
Optimizer: Adam
Learning Rate: 0.001
Batch Size: 32
Epochs: 50
Loss Function: Categorical Crossentropy
Early Stopping: Enabled
```

## 🏥 Classification Categories

### 1️⃣ **Glioma**
<img src="https://img.shields.io/badge/Type-Malignant-red" />

- **Origin**: Glial cells in the brain
- **Prevalence**: ~33% of all brain tumors
- **Characteristics**: Can be various grades (I-IV)
- **Location**: Cerebral hemispheres, brain stem
- **Growth**: Can be slow or aggressive

### 2️⃣ **Meningioma**
<img src="https://img.shields.io/badge/Type-Usually_Benign-yellow" />

- **Origin**: Meninges (brain/spinal cord membranes)
- **Prevalence**: Most common primary brain tumor
- **Characteristics**: Usually slow-growing
- **Location**: Surface of brain
- **Prognosis**: Generally good with treatment

### 3️⃣ **Pituitary Tumor**
<img src="https://img.shields.io/badge/Type-Usually_Benign-yellow" />

- **Origin**: Pituitary gland
- **Prevalence**: ~15% of intracranial tumors
- **Characteristics**: Affects hormone production
- **Location**: Pituitary fossa
- **Types**: Adenomas (most common)

### 4️⃣ **No Tumor**
<img src="https://img.shields.io/badge/Status-Healthy-green" />

- **Result**: Normal brain MRI
- **Indication**: No tumor patterns detected
- **Status**: Healthy brain tissue
- **Action**: Routine monitoring recommended

## ⚠️ Medical Disclaimer

> **CRITICAL NOTICE**: This project is developed for **academic, research, and educational purposes only**.

### Important Points:

❌ **NOT a Medical Device** - This system is not FDA-approved or certified for clinical use

❌ **NOT for Diagnosis** - Should NOT be used as the sole basis for medical diagnosis or treatment decisions

❌ **NOT a Replacement** - Does not replace qualified healthcare professionals, radiologists, or medical experts

✅ **AI-Assisted Tool** - Can be used as a preliminary screening tool to assist medical professionals

✅ **Research Purpose** - Demonstrates the potential of AI in medical imaging analysis

✅ **Educational Value** - Helps understand CNN applications in healthcare

### Recommendations:

1. **Always consult with qualified medical professionals** for diagnosis and treatment
2. **Use results as supplementary information** only
3. **Combine with other diagnostic methods** (clinical examination, advanced imaging)
4. **Obtain second opinions** from board-certified radiologists
5. **Follow established medical protocols** for brain tumor diagnosis

### Liability:

The developers and contributors of this project assume **no responsibility or liability** for any decisions made based on the predictions generated by this system. Users assume all risks associated with the use of this application.

## Project Objectives
- Develop an automated system for detecting brain tumors from MRI images
- Classify different types of brain tumors using deep learning
- Improve speed and consistency of MRI image analysis
- Reduce potential human error in image-based analysis
- Enhance feature extraction using CNNs
- Provide user-friendly interface for healthcare professionals

## Limitations of Traditional Methods
- Time-consuming manual analysis
- Subjective interpretation
- Variation between observers
- Difficulty handling large volumes of MRI scans
- Potential for human error
- Dependence on specialist expertise

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Include screenshots for UI changes

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prashanth Nemadi**

- 🐙 GitHub: [@prashanthnemadi18](https://github.com/prashanthnemadi18)
- 📧 Email: prashanthnemadi18@example.com
- 🔗 LinkedIn: [Prashanth Nemadi](https://linkedin.com/in/prashanthnemadi)

## 🙏 Acknowledgments

- **Dataset**: Brain MRI Images for Brain Tumor Detection
- **TensorFlow Team**: For the amazing deep learning framework
- **React Community**: For the powerful frontend library
- **Medical Experts**: For guidance on tumor classification
- **Open Source Community**: For the tools and libraries used

## 📞 Support

If you have any questions or need help:

1. 📖 Check the [Documentation](CHATBOT_GUIDE.md)
2. 🐛 Open an [Issue](https://github.com/prashanthnemadi18/Brain-Tumor-Identificatio/issues)
3. 💬 Start a [Discussion](https://github.com/prashanthnemadi18/Brain-Tumor-Identificatio/discussions)
4. 📧 Email: support@example.com

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

## 📚 Additional Documentation

- [Chatbot Guide](CHATBOT_GUIDE.md) - Complete NeuroBot documentation
- [Chatbot Features](CHATBOT_FEATURES.md) - Feature summary
- [Cleanup Summary](CLEANUP_SUMMARY.md) - Project maintenance
- [API Documentation](docs/API.md) - Backend API reference
- [Frontend Guide](docs/FRONTEND.md) - React component structure

## 🔮 Future Enhancements

- [ ] Add more tumor types (Astrocytoma, Oligodendroglioma)
- [ ] Implement 3D MRI analysis
- [ ] Real-time collaborative diagnosis
- [ ] Mobile application (iOS/Android)
- [ ] Integration with PACS systems
- [ ] Multi-language support
- [ ] Advanced analytics with AI insights
- [ ] Cloud deployment (AWS/Azure/GCP)
- [ ] Federated learning for privacy-preserving training
- [ ] Integration with EHR systems

---

<div align="center">

### Made with ❤️ for advancing healthcare through AI

**⭐ Star this repo if you find it useful!**

</div>
