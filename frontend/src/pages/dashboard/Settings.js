import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { IconSun, IconMoon, IconLogout, IconCheck, IconShield, IconSettings } from '../../components/icons';

const Toggle = ({ on, onChange, label, desc }) => (
  <div className="setting-row">
    <div className="setting-row__text">
      <strong>{label}</strong>
      {desc && <small>{desc}</small>}
    </div>
    <button
      className={`switch ${on ? 'switch--on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className="switch__knob" />
    </button>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState(() => JSON.parse(localStorage.getItem('bt_prefs') || '{"email":true,"browser":false,"summary":true}'));
  const [lang, setLang] = useState(() => localStorage.getItem('bt_lang') || 'en');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => { localStorage.setItem('bt_prefs', JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => { localStorage.setItem('bt_lang', lang); }, [lang]);

  const changePassword = (e) => {
    e.preventDefault();
    if (!pw.current || pw.next.length < 6) { setPwMsg('Enter current password and a new password of 6+ characters.'); return; }
    if (pw.next !== pw.confirm) { setPwMsg('New passwords do not match.'); return; }
    setPwMsg('');
    setPw({ current: '', next: '', confirm: '' });
    setPwMsg('Password change request recorded. (Demo — connect to a backend endpoint to persist.)');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-head__sub">Manage your account and application preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Account */}
        <section className="panel">
          <div className="panel__head"><h2><IconShield width={18} height={18} /> Account Settings</h2></div>
          <div className="settings-actions">
            <button className="btn btn-outline btn-block" onClick={() => navigate('/dashboard/profile')}>Update Profile</button>
          </div>
          <form className="pw-form" onSubmit={changePassword}>
            <h4>Change Password</h4>
            <input type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            <input type="password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            <input type="password" placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            {pwMsg && <div className="field-note">{pwMsg}</div>}
            <button className="btn btn-primary" type="submit"><IconCheck width={18} height={18} /> Update Password</button>
          </form>
          <div className="settings-actions">
            <button className="btn btn-danger btn-block" onClick={logout}><IconLogout width={18} height={18} /> Logout</button>
          </div>
        </section>

        {/* Application */}
        <section className="panel">
          <div className="panel__head"><h2><IconSettings width={18} height={18} /> Application Settings</h2></div>

          <div className="setting-row">
            <div className="setting-row__text">
              <strong>Appearance</strong>
              <small>Switch between light and dark mode.</small>
            </div>
            <button className="btn btn-outline btn-sm" onClick={toggleTheme}>
              {theme === 'light' ? <><IconMoon width={16} height={16} /> Dark</> : <><IconSun width={16} height={16} /> Light</>}
            </button>
          </div>

          <div className="setting-divider">Notifications</div>
          <Toggle label="Email notifications" desc="Analysis summaries via email" on={prefs.email} onChange={(v) => setPrefs({ ...prefs, email: v })} />
          <Toggle label="Browser notifications" desc="Alerts when analysis completes" on={prefs.browser} onChange={(v) => setPrefs({ ...prefs, browser: v })} />
          <Toggle label="Weekly report" desc="Receive a weekly analysis recap" on={prefs.summary} onChange={(v) => setPrefs({ ...prefs, summary: v })} />

          <div className="setting-divider">Language</div>
          <div className="setting-row">
            <div className="setting-row__text"><strong>Display language</strong></div>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
