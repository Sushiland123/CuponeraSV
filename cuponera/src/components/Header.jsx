import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem('usuarioLogueado');
      navigate('/login');
    });
  };

  return (
    <header className="bg-[#FAB26A] text-[#D54560] py-4 font-bold">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold">CuponeraSV</h1>
        <nav>
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
        <div>
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
      </div>
    </header>
  );
};

export default Header;