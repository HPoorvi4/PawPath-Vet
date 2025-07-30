import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const VetAuthContext = createContext();

export const VetAuthProvider = ({ children }) => {
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vetToken");
    const vetData = localStorage.getItem("vetData");

    if (token && vetData) {
      setVet(JSON.parse(vetData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("vetToken");
    localStorage.removeItem("vetData");
    setVet(null);
    window.location.href = "/login";
  };

  return (
    <VetAuthContext.Provider value={{ vet, loading, logout }}>
      {children}
    </VetAuthContext.Provider>
  );
};

const useVetAuth = () => useContext(VetAuthContext);
export default useVetAuth;