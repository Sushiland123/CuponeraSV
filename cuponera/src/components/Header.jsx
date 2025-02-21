import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Header = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem('usuarioLogueado');
      navigate('/login');
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#FAB26A] text-[#D54560] py-4 font-bold">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold">CuponeraSV</h1>
        <nav className="hidden sm:block">
          <ul className="flex space-x-6">
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/">Cupones disponibles</Link>
            </li>
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/empresas-aliadas">Empresas aliadas</Link>
            </li>
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/canjear-cupon">Canjear Cupones</Link>
            </li>
          </ul>
        </nav>
        <div className="hidden sm:flex">
          {user ? (
            <>
              <Link to="/mis-cupones" className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                Mis Cupones
              </Link>
              <button onClick={handleLogout} className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                Registrarse
              </Link>
              <Link to="/login" className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-3xl">&#9776;</button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden px-6 py-4">
          <ul className="space-y-4">
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/" onClick={closeMenu}>Cupones disponibles</Link>
            </li>
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/empresas-aliadas" onClick={closeMenu}>Empresas aliadas</Link>
            </li>
            <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
              <Link to="/canjear-cupon" onClick={closeMenu}>Canjear Cupones</Link>
            </li>
            {user ? (
              <>
                <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                  <Link to="/mis-cupones" onClick={closeMenu}>Mis Cupones</Link>
                </li>
                <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                  <button onClick={() => { handleLogout(); closeMenu(); }}>Cerrar sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                  <Link to="/register" onClick={closeMenu}>Registrarse</Link>
                </li>
                <li className="hover:bg-[#D54560] hover:text-[#FDD9B5] px-3 py-2 rounded">
                  <Link to="/login" onClick={closeMenu}>Iniciar sesión</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;