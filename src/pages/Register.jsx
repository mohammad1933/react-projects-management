import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form fields as user types
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.register(form);
      // Show the success message from backend
      setSuccess(res.data.message);
      // Redirect to a "check your email" page
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if(localStorage.getItem("auth-token") != "") navigate("/dashboard");
  },[navigate])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            placeholder="Password (min 8 chars)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

// Simple inline styles — replace with your CSS library if preferred
const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f2f5' },
  card:      { background:'#fff', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title:     { textAlign:'center', marginBottom:'1.5rem', color:'#1a1a2e' },
  input:     { display:'block', width:'100%', padding:'0.75rem 1rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', boxSizing:'border-box' },
  button:    { width:'100%', padding:'0.75rem', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  error:     { background:'#fee2e2', color:'#dc2626', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem' },
  success:   { background:'#dcfce7', color:'#16a34a', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem' },
  link:      { textAlign:'center', marginTop:'1rem', fontSize:'0.9rem' },
};