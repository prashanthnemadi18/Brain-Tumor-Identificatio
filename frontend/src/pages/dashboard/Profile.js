import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { IconSpark, IconCheck, IconClose } from '../../components/icons';

const Profile = () => {
  const { user, stats } = useOutletContext();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [editing, setEditing] = useState(false);
  const [created, setCreated] = useState('—');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authAPI.getUser(user.id);
        const d = res.data?.user?.created_at;
        setCreated(d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—');
      } catch { /* ignore */ }
    };
    if (user?.id) load();
  }, [user]);

  const save = () => {
    const updated = { ...user, name: form.name, email: form.email };
    localStorage.setItem('user', JSON.stringify(updated));
    window.dispatchEvent(new Event('bt:user-updated'));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="page-head__sub">Manage your account information.</p>
        </div>
      </div>

      <section className="panel profile-panel">
        <div className="profile-hero">
          <div className="profile-avatar">{(form.name || 'U')[0].toUpperCase()}</div>
          <div className="profile-hero__meta">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="pill pill--soft">
              <IconSpark width={14} height={14} /> {stats?.total_predictions || 0} MRI analyses
            </span>
          </div>
          {!editing && (
            <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>

        {saved && <div className="alert alert-success"><IconCheck width={18} height={18} /> Profile updated.</div>}

        <div className="profile-fields">
          <div className="field">
            <label>Full Name</label>
            {editing
              ? <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              : <div className="field__value">{user?.name}</div>}
          </div>
          <div className="field">
            <label>Username</label>
            <div className="field__value">{(user?.email || '').split('@')[0]}</div>
          </div>
          <div className="field">
            <label>Email</label>
            {editing
              ? <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              : <div className="field__value">{user?.email}</div>}
          </div>
          <div className="field">
            <label>Member Since</label>
            <div className="field__value">{created}</div>
          </div>
          <div className="field">
            <label>Total MRI Analyses</label>
            <div className="field__value">{stats?.total_predictions || 0}</div>
          </div>
        </div>

        {editing && (
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={save}><IconCheck width={18} height={18} /> Save Changes</button>
            <button className="btn btn-ghost" onClick={() => { setEditing(false); setForm({ name: user?.name, email: user?.email }); }}>
              <IconClose width={18} height={18} /> Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
