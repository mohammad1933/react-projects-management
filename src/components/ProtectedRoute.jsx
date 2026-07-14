import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Wrap any page with this to require login
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until we've checked localStorage before deciding
  if (loading) return <div style={styles.loading}>Loading...</div>;

  // Not logged in? Redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

const styles = {
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
};