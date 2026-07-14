import { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { saveAuth, user } = useAuth();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Separate state for "email not verified" scenario
  const [notVerified, setNotVerified] = useState(false);
  const [resendMsg,   setResendMsg]   = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotVerified(false);
    setLoading(true);

    try {
      const res  = await authService.login(form);
      const data = res.data.data;

      if (data.two_factor_required) {
        // Backend sent OTP — go to OTP verification page
        // Pass the email via navigation state
        navigate('/verify-otp', { state: { email: data.email } });
      } else {
        // Normal login — save token and redirect to dashboard
 console.log('token:', data.token);
console.log('user:', data.user);        saveAuth(data.token, data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        // Email not verified
        setNotVerified(true);
      } else {
        setError(err.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend the verification email
  const handleResend = async () => {
    try {
      const res = await authService.resendVerification(form.email);
      setResendMsg(res.data.message);
    } catch {
      setResendMsg('Failed to resend. Please try again.');
    }
  };

  // useEffect(()=>{
  //   if(user) navigate("/dashboard");
  // },[user]);

  useEffect(() => {
    if(localStorage.getItem("auth-token") != "") navigate("/dashboard");
  },[navigate])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* Show this block when email isn't verified */}
        {notVerified && (
          <div style={styles.warning}>
            <p>⚠️ Your email is not verified.</p>
            <button style={styles.resendBtn} onClick={handleResend}>
              Resend Verification Email
            </button>
            {resendMsg && <p style={{ marginTop: '0.5rem' }}>{resendMsg}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f2f5' },
  card:      { background:'#fff', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title:     { textAlign:'center', marginBottom:'1.5rem', color:'#1a1a2e' },
  input:     { display:'block', width:'100%', padding:'0.75rem 1rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', boxSizing:'border-box' },
  button:    { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  warning:   { background:'#fef9c3', color:'#854d0e', padding:'1rem', borderRadius:'8px', marginBottom:'1rem' },
  resendBtn: { marginTop:'0.5rem', padding:'0.5rem 1rem', background:'#ca8a04', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' },
  error:     { background:'#fee2e2', color:'#dc2626', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem' },
  link:      { textAlign:'center', marginTop:'1rem', fontSize:'0.9rem' },
};