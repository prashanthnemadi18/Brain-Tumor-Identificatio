# Contributing to Brain Tumor Identification System

First off, thank you for considering contributing to this project! 🎉

The following is a set of guidelines for contributing to this Brain Tumor Identification System. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to prashanthnemadi18@example.com.

### Our Standards

- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

#### How to Submit a Good Bug Report

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots)
- **Describe the behavior you observed** and what you expected
- **Include details about your configuration** (OS, Python version, Node version)

**Example Bug Report:**

```markdown
**Title:** Image upload fails with large MRI files

**Description:**
When uploading MRI images larger than 10MB, the upload fails with a 413 error.

**Steps to Reproduce:**
1. Go to Dashboard > Tumor Identification
2. Click "Browse Files"
3. Select an MRI image > 10MB
4. Click "Analyze Image"

**Expected Behavior:**
Image should upload successfully

**Actual Behavior:**
Error 413: Request Entity Too Large

**Environment:**
- OS: Windows 11
- Browser: Chrome 120
- Python: 3.11
- Flask: 3.0.0
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include mockups or examples** if applicable

### Pull Requests

#### Before Submitting a Pull Request

1. **Check existing PRs** to avoid duplicates
2. **Create an issue** describing what you want to do
3. **Fork the repository** and create your branch from `main`
4. **Make your changes** following our coding guidelines
5. **Test your changes** thoroughly
6. **Update documentation** if needed

#### Pull Request Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Brain-Tumor-Identificatio.git
   cd Brain-Tumor-Identificatio
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Follow existing code style

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

#### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] I have tested this code locally
- [ ] I have added tests that prove my fix/feature works
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's coding style
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB 6.0+
- Git

### Setup Instructions

1. **Clone and setup backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

2. **Setup frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your settings
   ```

4. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## Coding Guidelines

### Python (Backend)

#### Style Guide
- Follow **PEP 8** style guide
- Use **4 spaces** for indentation
- Maximum line length: **120 characters**
- Use **snake_case** for functions and variables
- Use **PascalCase** for classes

#### Example:
```python
def analyze_mri_image(image_path: str) -> dict:
    """
    Analyze an MRI image and return prediction results.
    
    Args:
        image_path (str): Path to the MRI image
        
    Returns:
        dict: Prediction results with confidence scores
    """
    # Load and preprocess image
    image = load_image(image_path)
    preprocessed = preprocess_image(image)
    
    # Make prediction
    prediction = model.predict(preprocessed)
    
    return format_prediction(prediction)
```

#### Best Practices
- ✅ Use type hints
- ✅ Write docstrings for functions
- ✅ Handle exceptions properly
- ✅ Use logging instead of print statements
- ✅ Keep functions small and focused

### JavaScript/React (Frontend)

#### Style Guide
- Use **ES6+** syntax
- Use **2 spaces** for indentation
- Use **camelCase** for variables and functions
- Use **PascalCase** for React components
- Use **functional components** with hooks

#### Example:
```javascript
import React, { useState, useEffect } from 'react';

const TumorAnalysis = ({ imageFile }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (imageFile) {
      analyzeImage(imageFile);
    }
  }, [imageFile]);

  const analyzeImage = async (file) => {
    setLoading(true);
    try {
      const response = await api.analyzeTumor(file);
      setResult(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tumor-analysis">
      {loading ? <Spinner /> : <Results data={result} />}
    </div>
  );
};

export default TumorAnalysis;
```

#### Best Practices
- ✅ Use functional components with hooks
- ✅ Prop-types or TypeScript for type checking
- ✅ Keep components small and reusable
- ✅ Use meaningful variable names
- ✅ Handle loading and error states

### CSS Styling

#### Guidelines
- Use **kebab-case** for class names
- Keep selectors **specific but not overly complex**
- Use **CSS variables** for theming
- Follow **BEM methodology** when appropriate

#### Example:
```css
/* Component-specific styles */
.tumor-analysis {
  padding: 20px;
  background: var(--bg-primary);
}

.tumor-analysis__header {
  font-size: 24px;
  color: var(--text-primary);
}

.tumor-analysis__result--success {
  color: var(--success-color);
}
```

## Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

**Good commit messages:**
```
feat(dashboard): add real-time analysis statistics

- Added live update functionality
- Implemented WebSocket connection
- Updated dashboard UI

Closes #123
```

```
fix(upload): resolve image validation error

Fixed issue where valid MRI images were rejected due to
incorrect MIME type checking.

Fixes #456
```

**Bad commit messages:**
```
update stuff
fixed bug
changes
```

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Adding new API endpoints
- Changing configuration options

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep README.md up to date
- Document API changes in API.md

## Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

- Aim for **>80% code coverage**
- Write tests for new features
- Update tests when fixing bugs
- Include edge cases

## Questions?

- 📧 Email: prashanthnemadi18@example.com
- 💬 GitHub Issues: [Create an issue](https://github.com/prashanthnemadi18/Brain-Tumor-Identificatio/issues)
- 💻 GitHub Discussions: [Start a discussion](https://github.com/prashanthnemadi18/Brain-Tumor-Identificatio/discussions)

---

Thank you for contributing! 🙏
