import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OfertasAprobadas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Alimentación");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Oferta"));
        const ofertasFiltradas = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((oferta) => oferta.vigente);

        setOfertas(ofertasFiltradas);
      } catch (error) {
        console.error("Error obteniendo ofertas:", error);
      }
    };

    obtenerOfertas();
  }, []);

  const formatearFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleComprarCupon = (ofertaId) => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");

    if (!usuarioLogueado) {
      navigate("/login");
    } else {
      navigate(`/detalles-oferta/${ofertaId}`);
    }
  };

  const categorias = ["Restaurantes", "Entretenimiento", "Educación", "Ferretería", "Decoración", "Servicios"];

  const renderizarOfertasPorRubro = () => {
    const ofertasFiltradas = ofertas.filter((oferta) => oferta.rubro === selectedCategory);

    if (ofertasFiltradas.length === 0) return <p>No hay ofertas disponibles en esta categoría.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ofertasFiltradas.map((oferta) => (
          <div key={oferta.id} className="border p-4 rounded-lg shadow-md">
            <img src={oferta.img_URL} alt={oferta.titulo} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{oferta.titulo}</h3>
            <p className="text-gray-600">{oferta.descripcion}</p>
            <p className="text-red-500 font-bold mt-1">
              Oferta: ${oferta.precio_oferta} <span className="line-through text-gray-400">${oferta.precio_regular}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              🛒 <strong>Compra hasta:</strong> {formatearFecha(oferta.fecha_fin)}
            </p>
            <p className="text-sm text-gray-700">
              ⏳ <strong>Válido hasta:</strong> {formatearFecha(oferta.fecha_limite_cupon)}
            </p>
            <button 
              onClick={() => handleComprarCupon(oferta.id)} 
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Comprar Cupón
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-red-600">Cupones Vigentes</h1>
      <nav className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mt-4 sm:space-y-0 space-y-2">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`px-4 py-2 ${selectedCategory === categoria ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg`}
            onClick={() => setSelectedCategory(categoria)}
          >
            {categoria}
          </button>
        ))}
      </nav>
      {renderizarOfertasPorRubro()}
    </div>
  );
};

export default OfertasAprobadas;
