import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loginWithOtp, requestOtp } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const LEN = 6, WAIT = 30;

export default function VerifyOTP() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { login } = useAuth();
  const [digits, setDigits] = useState(Array(LEN).fill(''));
  const [secs, setSecs] = useState(WAIT);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  if (!state || !state.phone) return <Navigate to="/signup" replace />;
  const { phone, dial } = state;

  function change(i, v) {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigits(a => a.map((x, j) => (j === i ? d : x)));
    if (d && i < LEN - 1) refs.current[i + 1].focus();
  }
  function key(i, e) { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1].focus(); }
  function paste(e) {
    const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN);
    if (!t) return;
    e.preventDefault();
    setDigits(Array.from({ length: LEN }, (_, i) => t[i] || ''));
    refs.current[Math.min(t.length, LEN - 1)].focus();
  }
  async function resend() {
    setError(''); setInfo('');
    try { await requestOtp(phone, dial); setSecs(WAIT); setInfo('A new OTP has been sent.'); }
    catch (err) { setError(err.message); }
  }
  async function submit(e) {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < LEN) return setError('Enter the 6-digit code.');
    setError(''); setBusy(true);
    try { login(await loginWithOtp(phone, otp, dial)); nav('/', { replace: true }); }
    catch (err) { setError(err.message || 'Invalid OTP.'); } finally { setBusy(false); }
  }
  return (
    <form className="screen auth" onSubmit={submit} noValidate>
      <div className="auth-top">
        <button type="button" className="back" aria-label="Back to sign up" onClick={() => nav('/signup')}><ArrowLeft size={20} /></button>
        <h1>6-digit code</h1>
        <p className="muted">Please enter the code we've sent to<br /><b className="dark">{dial} {phone}</b></p>
        <div className="otp" onPaste={paste}>
          {digits.map((d, i) => (
            <input key={i} ref={el => (refs.current[i] = el)} value={d} inputMode="numeric" autoComplete={i ? 'off' : 'one-time-code'}
              aria-label={`Digit ${i + 1}`} onChange={e => change(i, e.target.value)} onKeyDown={e => key(i, e)} />
          ))}
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {info && <p className="success" role="status">{info}</p>}
        <p className="resend">I didn't receive a code{' '}
          {secs > 0 ? <span className="orange">(00:{String(secs).padStart(2, '0')})</span>
            : <button type="button" className="link" onClick={resend}>Resend OTP</button>}
        </p>
      </div>
      <div className="auth-bottom"><button className="btn" disabled={busy}>{busy ? 'Verifying…' : 'Continue'}</button></div>
    </form>
  );
}
