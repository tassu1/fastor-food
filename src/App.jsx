import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Signup from './pages/Signup.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signup" replace />;
}
function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
export default function App() {
  return (
    <div className="shell"><div className="phone">
      <Routes>
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        <Route path="/verify" element={<PublicOnly><VerifyOTP /></PublicOnly>} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/product/:id" element={<Protected><ProductDetails /></Protected>} />
        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div></div>
  );
}
