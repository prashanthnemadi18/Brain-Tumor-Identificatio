"""
Chatbot API route for the Brain Tumor Identification project.

A lightweight, rule-based assistant that answers questions about the project,
how to use the app, the CNN model, and the tumor classes. It runs fully offline
(no external AI service needed) using keyword scoring over a knowledge base.
"""
import re
from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

chatbot_bp = Blueprint('chatbot', __name__)

# ---------------------------------------------------------------------------
# Knowledge base: each entry is (keywords, answer). The entry whose keywords
# best match the user's message wins.
# ---------------------------------------------------------------------------
KB = [
    {
        'keywords': ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'],
        'answer': (
            "Hello! 👋 I'm NeuroBot, the assistant for this Brain Tumor Identification "
            "project. Ask me things like:\n"
            "• What tumor types can this system detect?\n"
            "• How do I upload an MRI scan?\n"
            "• What model does the project use?\n"
            "• What does my confidence score mean?"
        ),
    },
    {
        'keywords': ['tumor type', 'types of tumor', 'classes', 'categories', 'classify',
                     'what can you detect', 'what does it detect', 'detect'],
        'answer': (
            "The CNN model classifies brain MRI scans into 4 categories:\n"
            "1. **Glioma** – tumor arising from glial (support) cells; the most common "
            "primary brain tumor, ranging from low- to high-grade.\n"
            "2. **Meningioma** – usually slow-growing, often benign tumor of the meninges "
            "(membranes covering the brain).\n"
            "3. **Pituitary tumor** – tumor of the pituitary gland, often affecting hormones.\n"
            "4. **No tumor** – a normal brain MRI.\n\n"
            "⚠️ Remember: these are AI-assisted research predictions, not a diagnosis. "
            "Always consult a qualified healthcare professional."
        ),
    },
    {
        'keywords': ['glioma'],
        'answer': (
            "**Glioma** is a tumor that starts in the glial cells that support and surround "
            "nerve cells. Common symptoms include persistent headaches, seizures, nausea or "
            "vomiting, changes in vision/speech/personality, and balance problems. A suspected "
            "glioma should be evaluated by a neurologist or neurosurgeon, typically with "
            "contrast MRI and clinical follow-up."
        ),
    },
    {
        'keywords': ['meningioma'],
        'answer': (
            "**Meningioma** is a tumor that arises from the meninges, the membranes "
            "surrounding the brain. It is usually slow-growing and often benign. Symptoms may "
            "include gradual vision or hearing changes, memory problems, worsening headaches, "
            "loss of smell, or limb weakness. It is commonly assessed with contrast MRI and "
            "monitored by a specialist over time."
        ),
    },
    {
        'keywords': ['pituitary'],
        'answer': (
            "**Pituitary tumor** develops in the pituitary gland at the base of the brain and "
            "often affects hormone production. Symptoms can include irregular menstruation or "
            "fertility issues, unexplained weight change, headaches, peripheral vision loss, and "
            "fatigue. Diagnosis usually involves hormone blood tests and a dedicated MRI, "
            "reviewed by an endocrinologist."
        ),
    },
    {
        'keywords': ['upload', 'how do i use', 'how to use', 'scan', 'mri image',
                     'how to check', 'how to predict', 'how to run prediction'],
        'answer': (
            "To analyze an MRI scan:\n"
            "1. Open the **Tumor Identification** page from the sidebar.\n"
            "2. Upload an MRI image (jpg/png) or capture one with your camera.\n"
            "3. Click **Analyze** — the image is preprocessed and passed to the CNN model.\n"
            "4. You'll see the predicted class with a confidence score.\n"
            "5. Results are saved to **Detection History**, where you can download a PDF report."
        ),
    },
    {
        'keywords': ['model', 'cnn', 'architecture', 'deep learning', 'neural network',
                     'accuracy', 'trained', 'training'],
        'answer': (
            "The project uses a Convolutional Neural Network (CNN) built with TensorFlow/Keras "
            "and trained on the Kaggle brain MRI dataset (Training/Testing folders in the "
            "`archive/` directory). Images are preprocessed with OpenCV (grayscale, resize, "
            "normalization) before prediction. The model is evaluated with accuracy, precision, "
            "recall, F1-score, and a confusion matrix — check the **Analytics** page for the "
            "live metrics."
        ),
    },
    {
        'keywords': ['confidence', 'score', 'percentage', 'probability', 'trust'],
        'answer': (
            "The **confidence score** is the probability (0–100%) the model assigns to its "
            "predicted class. Higher means the model is more certain, but even a high score is "
            "NOT a medical diagnosis — treat it as AI-assisted screening only. You can see the "
            "confidence for every class on the result page and in the PDF report."
        ),
    },
    {
        'keywords': ['history', 'previous', 'past prediction', 'old result', 'delete'],
        'answer': (
            "Every analysis you run is saved in **Detection History** (sidebar → History). "
            "There you can review past predictions, open details for each one, and download a "
            "comprehensive PDF report. Your history is tied to your account, so only you can "
            "see it."
        ),
    },
    {
        'keywords': ['report', 'pdf', 'download'],
        'answer': (
            "To download a report: open **Detection History**, click on a prediction, and use "
            "the **Download Report** button. It generates a PDF containing the prediction, "
            "confidence scores for all classes, the uploaded image, and a medical disclaimer."
        ),
    },
    {
        'keywords': ['tech', 'stack', 'built with', 'framework', 'react', 'flask', 'mongodb',
                     'database', 'backend', 'frontend'],
        'answer': (
            "Tech stack:\n"
            "• **Frontend**: React.js (React Router, Axios, custom CSS)\n"
            "• **Backend**: Python Flask REST API with JWT authentication\n"
            "• **Database**: MongoDB (users + prediction history)\n"
            "• **ML**: TensorFlow/Keras CNN, OpenCV, NumPy, scikit-learn\n"
            "• **Model file**: `efficientnet_brain_tumor.keras` / `.h5` variants in `backend/models/`"
        ),
    },
    {
        'keywords': ['login', 'register', 'sign up', 'account', 'password', 'auth'],
        'answer': (
            "You need an account to use the dashboard. Go to the **Login** page, switch to the "
            "**Register** tab, and create an account with your name, email and password. "
            "Passwords are hashed before being stored in MongoDB, and sessions use JWT tokens."
        ),
    },
    {
        'keywords': ['symptom', 'headache', 'seizure'],
        'answer': (
            "Common symptoms associated with brain tumors include persistent or worsening "
            "headaches, seizures, nausea/vomiting, vision or speech changes, personality "
            "changes, and balance/weakness problems. Symptoms alone can't diagnose a tumor — "
            "please see a doctor. I can tell you the typical symptom profile of glioma, "
            "meningioma, or pituitary tumors if you'd like."
        ),
    },
    {
        'keywords': ['disclaimer', 'accurate', 'reliable', 'medical advice', 'diagnosis'],
        'answer': (
            "⚠️ **Medical disclaimer**: This project is an academic/research prototype. The CNN "
            "predictions are AI-assisted results and must NOT be used as the sole basis for any "
            "medical diagnosis or treatment decision. Always consult qualified healthcare "
            "professionals."
        ),
    },
    {
        'keywords': ['help', 'what can you do', 'options', 'commands'],
        'answer': (
            "I can help with:\n"
            "• Tumor types & their symptoms (glioma, meningioma, pituitary)\n"
            "• How to upload an MRI and run a prediction\n"
            "• Understanding confidence scores\n"
            "• Prediction history & PDF reports\n"
            "• The tech stack and how the CNN model works\n"
            "Just type your question!"
        ),
    },
    {
        'keywords': ['thank', 'thanks', 'bye', 'goodbye'],
        'answer': "You're welcome! Stay healthy, and remember to consult a professional for any medical concerns. 👋",
    },
]

FALLBACK = (
    "I'm not sure about that one. 🤔 I'm the assistant for this Brain Tumor Identification "
    "project, so I can answer questions about tumor types, how to analyze an MRI scan, "
    "confidence scores, prediction history, PDF reports, or the tech stack. Try rephrasing, "
    "or type **help** to see what I can do."
)


def _best_match(message):
    """Return the KB entry with the highest keyword-overlap score, or None."""
    text = message.lower()
    best, best_score = None, 0
    for entry in KB:
        score = sum(1 for kw in entry['keywords'] if kw in text)
        if score > best_score:
            best, best_score = entry, score
    return best


@chatbot_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get('message') or '').strip()
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    match = _best_match(message)
    reply = match['answer'] if match else FALLBACK

    return jsonify({
        'reply': reply,
        'timestamp': datetime.utcnow().isoformat(),
    })
