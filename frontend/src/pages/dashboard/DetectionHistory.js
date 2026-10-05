import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { predictionAPI } from '../../services/api';
import { generatePredictionReport } from '../../utils/pdfGenerator';
import ConfidenceRing from '../../components/ConfidenceRing';
import { getTumorInfo, formatConfidence, formatDate } from '../../utils/tumorInfo';
import { IconSearch, IconBrain, IconDownload, IconClose, IconHistory } from '../../components/icons';

const PAGE_SIZE = 8;

const DetectionHistory = () => {
  const { history, user, search: globalSearch } = useOutletContext();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const openId = params.get('open');

  useEffect(() => {
    if (openId) loadDetail(openId);
  }, [openId]);

  const loadDetail = async (id) => {
    // Set URL parameter to open modal
    params.set('open', id);
    setParams(params);
    
    setLoadingDetail(true);
    try {
      const res = await predictionAPI.getPredictionDetails(id);
      setDetail(res.data);
    } catch (e) {
      console.error('Failed to load detail:', e);
      alert('Failed to load analysis details. Please try again.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setDetail(null);
    if (openId) { params.delete('open'); setParams(params, { replace: true }); }
  };

  const filtered = useMemo(() => {
    const q = (query || globalSearch || '').toLowerCase();
    const now = new Date();
    let rows = (history || []).filter((h) => {
      const info = getTumorInfo(h.predicted_class);
      if (q && !(`${info.name} ${h.image_filename}`.toLowerCase().includes(q))) return false;
      if (resultFilter === 'tumor' && !info.isTumor) return false;
      if (resultFilter === 'clear' && info.isTumor) return false;
      if (resultFilter !== 'all' && resultFilter !== 'tumor' && resultFilter !== 'clear' && h.predicted_class !== resultFilter) return false;
      if (dateFilter !== 'all') {
        const diff = (now - new Date(h.timestamp)) / 86400000;
        if (dateFilter === '7' && diff > 7) return false;
        if (dateFilter === '30' && diff > 30) return false;
        if (dateFilter === '90' && diff > 90) return false;
      }
      return true;
    });
    rows = rows.sort((a, b) =>
      sortBy === 'confidence'
        ? b.confidence - a.confidence
        : new Date(b.timestamp) - new Date(a.timestamp)
    );
    return rows;
  }, [history, query, globalSearch, resultFilter, dateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const detailDownload = () => {
    if (!detail) return;
    generatePredictionReport({ ...detail, prediction_id: detail.id }, user);
  };

  const info = detail ? getTumorInfo(detail.predicted_class) : null;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Detection History</h1>
          <p className="page-head__sub">All previously analyzed MRI scans.</p>
        </div>
      </div>

      <section className="panel">
        {/* Toolbar */}
        <div className="hist-toolbar">
          <div className="hist-search">
            <IconSearch width={18} height={18} />
            <input
              placeholder="Search by category or filename…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <select value={resultFilter} onChange={(e) => { setResultFilter(e.target.value); setPage(1); }}>
            <option value="all">All results</option>
            <option value="tumor">Tumor detected</option>
            <option value="clear">No tumor</option>
            <option value="glioma">Glioma</option>
            <option value="meningioma">Meningioma</option>
            <option value="pituitary">Pituitary</option>
            <option value="notumor">No Tumor</option>
          </select>
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}>
            <option value="all">Any date</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort: Newest</option>
            <option value="confidence">Sort: Confidence</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-mini empty-mini--tall">
            <IconHistory width={44} height={44} />
            <p>No analyses match your filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="hist-table">
                <thead>
                  <tr>
                    <th>MRI Image</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="ta-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((h) => {
                    const ci = getTumorInfo(h.predicted_class);
                    return (
                      <tr key={h.id}>
                        <td>
                          <div className="hist-cell-img">
                            <span className="hist-thumb" style={{ borderColor: ci.color }}>
                              <IconBrain width={20} height={20} style={{ color: ci.color }} />
                            </span>
                            <small className="hist-file" title={h.image_filename}>{h.image_filename}</small>
                          </div>
                        </td>
                        <td><span className="hist-cat" style={{ color: ci.color }}>{ci.name}</span></td>
                        <td>
                          <div className="mini-conf">
                            <div className="mini-conf__bar"><div className="mini-conf__fill" style={{ width: `${h.confidence * 100}%`, background: ci.color }} /></div>
                            <span>{formatConfidence(h.confidence)}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`tag ${ci.isTumor ? 'tag--tumor' : 'tag--clear'}`}>
                            {ci.isTumor ? 'Tumor' : 'Clear'}
                          </span>
                        </td>
                        <td><small>{formatDate(h.timestamp)}</small></td>
                        <td className="ta-right">
                          <button className="btn btn-ghost btn-sm" onClick={() => loadDetail(h.id)}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pager">
              <span className="pager__info">
                Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="pager__btns">
                <button className="btn btn-ghost btn-sm" disabled={current === 1} onClick={() => setPage(current - 1)}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((p) => (
                  <button key={p} className={`pager__num ${p === current ? 'is-active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="btn btn-ghost btn-sm" disabled={current === totalPages} onClick={() => setPage(current + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Detail modal */}
      {openId && (
        <div className="modal" onClick={closeDetail}>
          <div className="modal__card" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeDetail}><IconClose width={20} height={20} /></button>
            {loadingDetail || !detail ? (
              <div className="empty-mini empty-mini--tall"><p>Loading result…</p></div>
            ) : (
              <div className="result">
                <div className={`result__status ${info.isTumor ? 'is-tumor' : 'is-clear'}`}>
                  <span className="result__status-dot" />
                  {info.isTumor ? 'Possible Tumor Detected' : 'No Tumor Detected'}
                </div>
                <div className="result__headline" style={{ textAlign: 'center' }}>
                  <small>{detail.image_filename}</small>
                  <h3 style={{ color: info.color }}>{info.name}</h3>
                  <ConfidenceRing value={detail.confidence} color={info.color} size={130} stroke={12} />
                </div>
                {detail.class_probabilities && (
                  <div className="probs">
                    <h4>Confidence by Category</h4>
                    {Object.entries(detail.class_probabilities).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
                      const ci = getTumorInfo(k);
                      return (
                        <div key={k} className="prob-row">
                          <span className="prob-row__label">{ci.name}</span>
                          <div className="prob-row__bar"><div className="prob-row__fill" style={{ width: `${v * 100}%`, background: ci.color }} /></div>
                          <span className="prob-row__val">{formatConfidence(v)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="guidance">
                  <IconBrain width={22} height={22} />
                  <p>{info.summary} {info.guidance}</p>
                </div>
                <div className="result__actions">
                  <button className="btn btn-primary" onClick={detailDownload}><IconDownload width={18} height={18} /> Download Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionHistory;
