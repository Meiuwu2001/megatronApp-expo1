import React, { createContext, useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authReducer } from "./UsuarioReducer";
import LoadingScreen from "../components/navigation/LoadingScreen";

export const authInitialState = {
  user: "",
  token: "",
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUser = await AsyncStorage.getItem("authUser");

      if (storedToken) {
        dispatch({
          type: "signIn",
          payload: { token: storedToken, user: JSON.parse(storedUser) },
        });
      }
      setLoading(false); // Cambiar estado a false después de cargar los datos
    };

    loadToken();
  }, []);

  const signIn = async (user, token) => {
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("authUser", JSON.stringify(user));

    dispatch({ type: "signIn", payload: { user, token } });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");

    dispatch({ type: "signOut" });
  };

  // Asegurarse de que la aplicación espere la carga de datos antes de continuar
  if (loading) {
    return <LoadingScreen />; // Puedes crear un LoadingScreen simple o componente de carga
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
