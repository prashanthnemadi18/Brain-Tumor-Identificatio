import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { predictionAPI } from '../../services/api';
import { generatePredictionReport } from '../../utils/pdfGenerator';
import ConfidenceRing from '../../components/ConfidenceRing';
import { getTumorInfo, formatConfidence, formatDate } from '../../utils/tumorInfo';
import {
  IconUpload, IconCamera, IconClose, IconBrain,
  IconDownload, IconSpark, IconShield, IconCheck,
} from '../../components/icons';

const ACCEPT = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const TumorIdentification = () => {
  const { user, refresh } = useOutletContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dims, setDims] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => stopCamera(), []);

  const applyFile = (f) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) {
      setError('Please choose a valid image (PNG, JPG, JPEG or WEBP).');
      return;
    }
    if (f.size > 16 * 1024 * 1024) {
      setError('File size must be under 16MB.');
      return;
    }
    setError('');
    setResult(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setDims(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 80);
    } catch {
      setError('Unable to access camera. Check permissions, or upload an MRI file instead.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) { setError('Capture failed. Try again.'); return; }
      applyFile(new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' }));
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const analyze = async () => {
    if (!file) { setError('Select or capture an image first.'); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await predictionAPI.predict(fd);
      setResult(res.data);
      refresh();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Analysis failed. Ensure the backend is running and the model is loaded.'
      );
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const r = generatePredictionReport(result, user);
    if (!r.success) setError('Failed to generate report: ' + r.error);
  };

  const info = result ? getTumorInfo(result.predicted_class) : null;
  const isTumor = info?.isTumor;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Tumor Identification</h1>
          <p className="page-head__sub">Upload or capture a brain MRI scan for AI-assisted analysis.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-2-1">
        {/* Left: input + preview */}
        <section className="panel">
          <div className="panel__head"><h2>MRI Image Input</h2></div>

          <div className="alert alert-info">
            <IconShield width={20} height={20} />
            <div>
              Use a proper <strong>grayscale brain MRI</strong> image file for meaningful analysis.
              Non-medical or color photos will be rejected by the validator.
            </div>
          </div>

          {!preview && !cameraOn && (
            <>
              <div
                className={`dropzone ${dragging ? 'dropzone--active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <IconUpload width={46} height={46} />
                <p className="dropzone__title">Drag &amp; Drop MRI Image Here</p>
                <p className="dropzone__hint">or</p>
                <span className="btn btn-primary btn-sm">Browse Image</span>
                <small className="dropzone__formats">PNG · JPG · JPEG · WEBP · Max 16MB</small>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT.join(',')}
                hidden
                onChange={(e) => applyFile(e.target.files?.[0])}
              />
              <div className="input-divider"><span>or</span></div>
              <button className="btn btn-outline btn-block" onClick={startCamera}>
                <IconCamera width={20} height={20} /> Use Camera / Image Capture
              </button>
            </>
          )}

          {cameraOn && (
            <div className="camera-box">
              <video ref={videoRef} autoPlay playsInline className="camera-box__video" />
              <canvas ref={canvasRef} hidden />
              <div className="camera-box__controls">
                <button className="btn btn-primary" onClick={capture}>
                  <IconCamera width={18} height={18} /> Capture
                </button>
                <button className="btn btn-ghost" onClick={stopCamera}>
                  <IconClose width={18} height={18} /> Cancel
                </button>
              </div>
            </div>
          )}

          {preview && (
            <div className="preview">
              <div className="preview__img">
                <img src={preview} alt="MRI preview" />
                <button className="preview__remove" onClick={removeImage} aria-label="Remove image">
                  <IconClose width={16} height={16} />
                </button>
              </div>
              <div className="preview__meta">
                <div><span>Filename</span><strong title={file.name}>{file.name}</strong></div>
                <div><span>Dimensions</span><strong>{dims ? `${dims.w} × ${dims.h}px` : 'Reading…'}</strong></div>
                <div><span>Size</span><strong>{(file.size / 1024).toFixed(0)} KB</strong></div>
                <div><span>Type</span><strong>{file.type.replace('image/', '').toUpperCase()}</strong></div>
              </div>
              <div className="preview__actions">
                <button className="btn btn-primary" onClick={analyze} disabled={loading}>
                  {loading ? (
                    <span className="loading-text"><span className="spinner-small" /> Analyzing…</span>
                  ) : (<><IconSpark width={18} height={18} /> Analyze MRI</>)}
                </button>
                <button className="btn btn-ghost" onClick={() => inputRef.current?.click()} disabled={loading}>
                  Change Image
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right: processing / result / placeholder */}
        <section className="panel">
          <div className="panel__head"><h2>Analysis Result</h2></div>

          {loading && (
            <div className="analyzing">
              <div className="analyzing__brain"><IconBrain width={64} height={64} /></div>
              <h3>Analyzing MRI Scan…</h3>
              <div className="analyzing__bar"><span /></div>
              <p>AI model is analyzing the uploaded image.</p>
              <ul className="analyzing__steps">
                {['Validating image', 'Preprocessing & normalization', 'Running model inference', 'Generating results'].map((s, i) => (
                  <li key={s} style={{ animationDelay: `${i * 0.4}s` }}><IconCheck width={15} height={15} /> {s}</li>
                ))}
              </ul>
            </div>
          )}

          {!loading && !result && (
            <div className="empty-mini empty-mini--tall">
              <IconBrain width={44} height={44} />
              <p>Upload an MRI and click <strong>Analyze MRI</strong> to see the prediction, confidence and guidance here.</p>
            </div>
          )}

          {!loading && result && (
            <div className="result">
              <div className={`result__status ${isTumor ? 'is-tumor' : 'is-clear'}`}>
                <span className="result__status-dot" />
                {isTumor ? 'Possible Tumor Detected' : 'No Tumor Detected'}
              </div>

              <div className="result__top">
                <div className="result__thumb">
                  {preview && <img src={preview} alt="Analyzed MRI" />}
                </div>
                <div className="result__headline">
                  <small>Prediction</small>
                  <h3 style={{ color: info.color }}>{info.name}</h3>
                  <div className="result__conf">
                    <ConfidenceRing value={result.confidence} color={info.color} size={120} stroke={11} />
                  </div>
                </div>
              </div>

              <div className="result__summary">
                <h4>AI Analysis Summary</h4>
                <p>
                  The model classified this scan as <strong style={{ color: info.color }}>{info.name}</strong>{' '}
                  with <strong>{formatConfidence(result.confidence)}</strong> confidence.
                  {' '}{info.summary}
                </p>
              </div>

              {result.class_probabilities && (
                <div className="probs">
                  <h4>Confidence by Category</h4>
                  {Object.entries(result.class_probabilities)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => {
                      const ci = getTumorInfo(k);
                      return (
                        <div key={k} className="prob-row">
                          <span className="prob-row__label">{ci.name}</span>
                          <div className="prob-row__bar">
                            <div className="prob-row__fill" style={{ width: `${v * 100}%`, background: ci.color }} />
                          </div>
                          <span className="prob-row__val">{formatConfidence(v)}</span>
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="med-info">
                <div className="med-info__block">
                  <h4>General Information</h4>
                  <p>{info.short}</p>
                </div>
                {info.symptoms?.length > 0 && (
                  <div className="med-info__block">
                    <h4>Possible Symptoms</h4>
                    <ul className="symptom-list">
                      {info.symptoms.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="guidance">
                <IconShield width={22} height={22} />
                <p>
                  This AI result is for preliminary analysis and should not be considered a medical
                  diagnosis. Please consult a qualified healthcare professional for proper evaluation.
                  {info.guidance}
                </p>
              </div>

              <div className="result__meta">
                <span>ID: {result.prediction_id}</span>
                <span>{formatDate(result.timestamp)}</span>
              </div>

              <div className="result__actions">
                <button className="btn btn-primary" onClick={download}>
                  <IconDownload width={18} height={18} /> Download Report
                </button>
                <button className="btn btn-ghost" onClick={removeImage}>
                  <IconSpark width={18} height={18} /> New Analysis
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TumorIdentification;
