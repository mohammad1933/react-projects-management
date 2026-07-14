import { useSearchParams, Link } from 'react-router-dom';

// This page is what the user lands on after clicking the verification link in their email
export default function EmailVerified() {
  const [params] = useSearchParams();
  const status   = params.get('status'); // 'success' or 'already_verified'

  const isSuccess = status === 'success' || status === 'already_verified';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>{isSuccess ? '✅' : '❌'}</div>
        <h2 style={styles.title}>
          {isSuccess ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        <p style={styles.message}>
          {status === 'success'          && 'Your email has been verified. You can now log in.'}
          {status === 'already_verified' && 'Your email was already verified. You can log in.'}
          {!isSuccess                    && 'The verification link is invalid or has expired.'}
        </p>
        <Link to="/login" style={styles.button}>Go to Login</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f2f5' },
  card:      { background:'#fff', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'400px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', textAlign:'center' },
  icon:      { fontSize:'3rem', marginBottom:'1rem' },
  title:     { color:'#1a1a2e', marginBottom:'0.5rem' },
  message:   { color:'#666', marginBottom:'1.5rem' },
  button:    { display:'inline-block', padding:'0.75rem 2rem', background:'#4f46e5', color:'#fff', borderRadius:'8px', textDecoration:'none' },
};