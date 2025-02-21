import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const MisCupones = () => {
  const [cupones, setCupones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  //Hook para verificar si la persona está logueada, si lo está buscar y mostrar los cupones que están comprados con su cuenta.
  useEffect(() => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    console.log("Usuario logueado:", usuarioLogueado); // 🔍 Verificar usuario
    if (!usuarioLogueado) return;
    setUsuario(usuarioLogueado);

    const cuponesRef = collection(db, "CuponesComprados");
    const q = query(cuponesRef, where("userId", "==", usuarioLogueado.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cuponesComprados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Cupones cargados:", cuponesComprados); // 🔍 Verificar si se obtienen cupones
      setCupones(cuponesComprados);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-red-600">Mis Cupones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cupones.map(cupon => (
          <div key={cupon.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{cupon.titulo}</h3>
            <p className="text-gray-600">{cupon.descripcion}</p>
            <p className="text-red-500 font-bold mt-1">Código: {cupon.codigo}</p>
            <p className="text-sm text-gray-700 mt-1">
              🛒 <strong>Precio Oferta:</strong> ${cupon.precio_oferta} 
              <span className="line-through text-gray-400">${cupon.precio_regular}</span>
            </p>
            <p className="text-sm text-gray-700">
              ⏳ <strong>Válido hasta:</strong> {new Date(cupon.fecha_limite_cupon.seconds * 1000).toLocaleDateString("es-ES")}
            </p>
            <p className={`text-sm font-bold mt-2 ${cupon.estado === "canjeado" ? "text-green-600" : "text-blue-500"}`}>
              Estado: {cupon.estado === "canjeado" ? "✅ Canjeado" : "❌ No Canjeado"}
            </p>

            {usuario && usuario.rol === "empleado" && cupon.estado !== "canjeado" && (
              <button
                onClick={() => navigate(`/canjear-cupon?codigo=${cupon.codigo}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Canjear
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisCupones;
