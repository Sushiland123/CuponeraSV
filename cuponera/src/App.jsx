import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import OfertasAprobadas from './components/OfertasAprobadas'; 
import MisCupones from './components/MisCupones.jsx';
import Dashboard from './components/Dashboard';
import DetallesOferta from './components/DetallesOferta';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import "./index.css";
import CanjearCupon from "./components/CanjearCupon";

<Route path="/canjear-cupon" element={<CanjearCupon />} />

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        <Header user={user} />

        <div className="container mx-auto px-6 py-12">
          <Routes>
<Route path="/canjear-cupon" element={<CanjearCupon />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<OfertasAprobadas />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/mis-cupones" element={<ProtectedRoute><MisCupones /></ProtectedRoute>} />
            <Route path="/detalles-oferta/:ofertaId" element={<ProtectedRoute><DetallesOferta /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;