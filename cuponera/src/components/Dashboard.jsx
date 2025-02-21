import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");

    if (!usuarioLogueado) {
      navigate("/login"); // Redirige al login si no hay usuario logueado
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">Bienvenido al Dashboard</h2> 
      <p className="text-center mt-4">Aquí podrás gestionar tus cupones y ver tus ofertas</p>
    </div>
  );//luego de verificar que la persona está logueada, permitirá al usuario pasar al Dashboard, si no está logueado lo va a redirigir al login.
};

export default Dashboard;