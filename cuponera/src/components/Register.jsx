import { useState, useEffect } from "react";
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  //Por seguridad debe aceptar los términos y servicios 
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Debes aceptar los términos y servicios");
      return;
    }
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      alert("Registro exitoso 🎉. Por favor verifica tu correo electrónico.");
//Al registrarse correctamente el usuario DEBE verificar su correo 
      localStorage.setItem("usuarioLogueado", JSON.stringify({ uid: user.uid, email: user.email }));
      navigate("/dashboard");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya ha sido registrado");
      } else {
        setError("Error: " + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert("Registro con Google exitoso ✅");

      localStorage.setItem("usuarioLogueado", JSON.stringify({ uid: user.uid, email: user.email }));
      navigate("/dashboard");
    } catch (err) {
      setError("Error con Google: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1E4D1]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-6 sm:mt-0">
        <h2 className="text-2xl font-bold text-center text-[#162660]">Registrarse</h2>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleRegister} className="mt-4">
          <div>
            <label className="block text-sm font-medium text-[#162660]">Correo Electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#162660]">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#162660]"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-[#162660] border-gray-300 rounded" 
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <span className="ml-2 text-sm text-[#162660]">
                Acepto <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">términos y servicios</a>
              </span>
            </label>
          </div>

          <button type="submit" className="w-full px-4 py-2 mt-4 text-[#D0E6FD] bg-[#162660] rounded-lg hover:bg-[#101A45]">
            Registrarse
          </button>

          <button type="button" onClick={handleGoogleLogin} className="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded-lg hover:bg-red-600">
            Registrarse con Google
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[#162660]">
          ¿Ya tienes cuenta? <a href="/login" className="text-[#162660] hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
