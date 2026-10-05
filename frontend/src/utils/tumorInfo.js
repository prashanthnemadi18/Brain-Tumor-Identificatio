// Shared metadata for the tumor classes supported by the trained model.
// Keep keys in sync with backend Config.TUMOR_CLASSES:
// ['glioma', 'meningioma', 'notumor', 'pituitary']

export const TUMOR_INFO = {
  glioma: {
    name: 'Glioma',
    color: '#ef476f',
    isTumor: true,
    short: 'Tumor arising from the glial (support) cells of the brain or spine.',
    summary:
      'Gliomas are the most common primary brain tumors and range from low-grade to high-grade. They start in the cells that help support and surround nerve cells.',
    symptoms: [
      'Persistent or worsening headaches',
      'Seizures',
      'Nausea or vomiting',
      'Changes in vision, speech or personality',
      'Balance problems and weakness',
    ],
    guidance:
      'A suspected glioma should be evaluated by a neurologist or neurosurgeon, typically with contrast MRI and clinical follow-up.',
  },
  meningioma: {
    name: 'Meningioma',
    color: '#118ab2',
    isTumor: true,
    short: 'Tumor arising from the meninges, the membranes surrounding the brain.',
    summary:
      'Meningiomas are usually slow-growing and often benign tumors that form in the membranes (meninges) covering the outside of the brain.',
    symptoms: [
      'Gradual vision or hearing changes',
      'Memory problems',
      'Headaches that worsen over time',
      'Loss of smell',
      'Weakness in limbs',
    ],
    guidance:
      'Meningiomas are commonly assessed with contrast MRI and monitored over time by a specialist.',
  },
  pituitary: {
    name: 'Pituitary Tumor',
    color: '#f78c6b',
    isTumor: true,
    short: 'Tumor in the pituitary gland that can affect hormone regulation.',
    summary:
      'Pituitary tumors develop in the pituitary gland at the base of the brain and often affect hormone production.',
    symptoms: [
      'Irregular menstruation or fertility issues',
      'Unexplained weight change',
      'Headaches',
      'Vision loss (especially peripheral)',
      'Fatigue and hormonal imbalance',
    ],
    guidance:
      'Pituitary tumors usually require hormone blood tests and dedicated MRI, reviewed by an endocrinologist.',
  },
  notumor: {
    name: 'No Tumor Detected',
    color: '#06d6a0',
    isTumor: false,
    short: 'No tumor-like abnormality was identified in the scanned region.',
    summary:
      'The AI model did not detect a tumor pattern in this image. This is a preliminary, screen-level indication only.',
    symptoms: ['No tumor-specific symptoms indicated by this scan.'],
    guidance:
      'Continue routine follow-up with your healthcare provider, especially if symptoms persist.',
  },
  unknown: {
    name: 'Other / Unknown',
    color: '#8d99ae',
    isTumor: false,
    short: 'Category could not be confidently matched to a known class.',
    summary: 'The prediction did not clearly match a supported tumor category.',
    symptoms: [],
    guidance: 'Please re-upload a clearer brain MRI scan or consult a professional.',
  },
};

export const getTumorInfo = (key) =>
  TUMOR_INFO[(key || '').toLowerCase()] || TUMOR_INFO.unknown;

export const formatConfidence = (value) => `${(value * 100).toFixed(1)}%`;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateShort = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
