import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext.jsx';

export default function VerifyOtp() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { saveAuth } = useAuth();

  // Email was passed from the Login page via navigate state
  const email = location.state?.email;

  const [otp,     setOtp]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // If someone lands here directly without an email, redirect them
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await authService.verifyOtp({ email, otp });
      console.log(res.data);
      const data = res.data.data;

      saveAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Two-Factor Authentication</h2>
        <p style={styles.subtitle}>
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={{ ...styles.input, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <p style={styles.link}>
          Wrong account? <a href="/login">Go back to Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f2f5' },
  card:      { background:'#fff', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', textAlign:'center' },
  title:     { marginBottom:'0.5rem', color:'#1a1a2e' },
  subtitle:  { color:'#666', marginBottom:'1.5rem', fontSize:'0.9rem' },
  input:     { display:'block', width:'100%', padding:'0.75rem 1rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', boxSizing:'border-box' },
  button:    { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  error:     { background:'#fee2e2', color:'#dc2626', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem' },
  link:      { marginTop:'1rem', fontSize:'0.9rem' },
};