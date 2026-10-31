import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp } from '../services/authService.js';

const CODES = ['+91', '+1', '+44', '+61', '+971', '+65'];

export default function Signup() {
  const nav = useNavigate();
  const [dial, setDial] = useState('+91');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!/^\d{7,12}$/.test(phone)) return setError('Enter a valid mobile number (digits only).');
    if (dial === '+91' && !/^[6-9]\d{9}$/.test(phone)) return setError('Indian numbers have 10 digits and start with 6-9.');
    setError(''); setBusy(true);
    try {
      await requestOtp(phone, dial);
      nav('/verify', { state: { phone, dial } });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return (
    <form className="screen auth" onSubmit={submit} noValidate>
      <div className="auth-top">
        <h1>Sign Up to Fastor</h1>
        <p className="muted">Let us know your mobile number and we will send you an OTP for verification.</p>
        <div className={`phone-field ${error ? 'has-error' : ''}`}>
          <select aria-label="Country dial code" value={dial} onChange={e => setDial(e.target.value)}>
            {CODES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input aria-label="Mobile number" inputMode="numeric" autoComplete="tel-national" placeholder="00000"
            value={phone} maxLength={12} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
      <div className="auth-bottom">
        <button className="btn" disabled={busy}>{busy ? 'Sending OTP…' : 'Get OTP'}</button>
        <p className="terms">By clicking, I accept the <b>Terms &amp; Conditions</b> and <b>Privacy Policy</b></p>
      </div>
    </form>
  );
}
