import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const DetallesOferta = () => {
  const { ofertaId } = useParams();
  const [oferta, setOferta] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerOferta = async () => {
      try {
        const docRef = doc(db, "Oferta", ofertaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOferta(docSnap.data());
        } else {
          console.log("No se encontró la oferta.");
          navigate("/"); // Redirigir si no se encuentra la oferta
        }
      } catch (error) {
        console.error("Error al obtener la oferta:", error);
      }
    };

    obtenerOferta();
  }, [ofertaId, navigate]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (!user.emailVerified) {
          setError("Por favor, verifica tu correo electrónico antes de realizar una compra.");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const luhnCheck = (val) => {
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
      let intVal = parseInt(val.substr(i, 1));
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) {
          intVal = 1 + (intVal % 10);
        }
      }
      sum += intVal;
    }
    return (sum % 10) === 0;
  };

  const handlePayment = async () => {
    setError("");
    if (!cardNumber || !expiryDate || !cardholderName || !cvc) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!luhnCheck(cardNumber)) {
      setError("Número de tarjeta inválido");
      return;
    }

    if (!user || !user.emailVerified) {
      setError("Por favor, verifica tu correo electrónico antes de realizar una compra.");
      return;
    }

    try {
      const cupon = {
        userId: user.uid,
        ofertaId,
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        precio_oferta: oferta.precio_oferta,
        precio_regular: oferta.precio_regular,
        fecha_compra: new Date(),
        fecha_limite_cupon: oferta.fecha_limite_cupon,
        codigo: Math.random().toString(36).substr(2, 9).toUpperCase()
      };

      await addDoc(collection(db, "CuponesComprados"), cupon);
      alert("Tu pago ha sido exitoso, puedes revisar tu cupón en la sección de mis cupones.");
      navigate("/mis-cupones");
    } catch (error) {
      console.error("Error al generar el cupón:", error);
      setError(`Hubo un error al procesar el pago. Inténtalo de nuevo. Detalles del error: ${error.message}`);
    }
  };

  if (!oferta) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-red-600">{oferta.titulo}</h1>
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <img src={oferta.img_URL} alt={oferta.titulo} className="w-full h-60 object-cover rounded-md" />
        <p className="text-gray-600 mt-4">{oferta.descripcion}</p>
        <p className="text-red-500 font-bold mt-2">
          Oferta: ${oferta.precio_oferta} <span className="line-through text-gray-400">${oferta.precio_regular}</span>
        </p>
        <p className="text-sm text-gray-700 mt-1">
          🛒 <strong>Compra hasta:</strong> {new Date(oferta.fecha_fin.seconds * 1000).toLocaleDateString("es-ES")}
        </p>
        <p className="text-sm text-gray-700">
          ⏳ <strong>Válido hasta:</strong> {new Date(oferta.fecha_limite_cupon.seconds * 1000).toLocaleDateString("es-ES")}
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#162660]">Número de tarjeta</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
            placeholder="Ingresa tu número de tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#162660]">Fecha de vencimiento</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#162660]">Nombre del titular</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
            placeholder="Ingresa el nombre del titular"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#162660]">CVC</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
            placeholder="Ingresa el CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button 
          onClick={handlePayment}
          className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Pagar
        </button>
      </div>
    </div>
  );
};

export default DetallesOferta;