import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const CanjearCupon = () => {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleCanjear = async () => {
    if (!codigoCupon) {
      setMensaje("Por favor, ingrese un código de cupón.");
      return;
    }
    
    try {
      const cuponesRef = collection(db, "CuponesComprados");
      const q = query(cuponesRef, where("codigo", "==", codigoCupon));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMensaje("Cupón no encontrado.");
        return;
      }

      const cuponDoc = querySnapshot.docs[0];
      const cuponRef = cuponDoc.ref;
      const cuponData = cuponDoc.data();

      if (cuponData.estado === "canjeado") {
        setMensaje("Este cupón ya ha sido canjeado.");
        return;
      }

      await updateDoc(cuponRef, { estado: "canjeado" });
      setMensaje("Cupón canjeado con éxito.");
    } catch (error) {
      setMensaje("Error al canjear el cupón. Intente de nuevo.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Canjear Cupón</h2>
      <input
        type="text"
        placeholder="Ingrese el código del cupón"
        value={codigoCupon}
        onChange={(e) => setCodigoCupon(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={handleCanjear}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Canjear
      </button>
      {mensaje && <p className="mt-4 text-red-500">{mensaje}</p>}
    </div>
  );
};

export default CanjearCupon;
