import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AuthContext } from "../context/UsuarioContext";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FingerprintScanner from "react-native-fingerprint-scanner"; // Importar la librería

const Login = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    // Verifica si la huella dactilar está disponible en el dispositivo
    FingerprintScanner.isSensorAvailable()
      .then(() => setIsFingerprintAvailable(true))
      .catch((error) => {
        console.error("Fingerprint scanner error:", error);
        setIsFingerprintAvailable(false);
      });

    // Limpiar la huella al desmontar el componente
    return () => FingerprintScanner.release();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://backend-integradora.vercel.app/api/auth/iniciar-sesion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, password }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Almacenar el token en AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
        context.signIn(user, data.token);

        // Limpiar campos de usuario y contraseña
        setUser("");
        setPassword("");

        // Redirigir al usuario a la pantalla principal
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
        navigation.dispatch(resetAction);
      } else {
        console.log("No token found.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const handleFingerprintAuth = () => {
    // Intenta autenticar al usuario con la huella
    FingerprintScanner.authenticate({
      description: "Inicia sesión con tu huella",
    })
      .then(async (success) => {
        console.log("Autenticación exitosa:", success);

        // Obtener el token desde el servidor y almacenarlo
        const response = await fetch(
          "https://backend-integradora.vercel.app/api/auth/iniciar-sesion",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, password }), // Aquí deberías cambiar para autenticar sin usar password si es necesario
          }
        );
        const data = await response.json();

        if (response.ok) {
          // Almacenar el token en AsyncStorage
          await AsyncStorage.setItem("authToken", data.token);
          context.signIn(user, data.token);

          // Redirigir al usuario a la pantalla principal
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: "MainApp" }],
          });
          navigation.dispatch(resetAction);
        }
      })
      .catch((error) => {
        console.error("Error de autenticación:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Hola</Text>
              <Text style={styles.subtitle}>Inicia sesión con tu cuenta</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Usuario</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu usuario..."
                  value={user}
                  onChangeText={setUser}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              {/* Mostrar botón de huella si está disponible */}
              {isFingerprintAvailable && (
                <TouchableOpacity
                  style={styles.fingerprintButton}
                  onPress={handleFingerprintAuth}
                >
                  <Text style={styles.fingerprintButtonText}>
                    Iniciar sesión con huella
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00205B",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 200,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    minHeight: "70%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00205B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#00205B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  forgotPassword: {
    color: "#4751FF",
    textAlign: "right",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#4751FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fingerprintButton: {
    backgroundColor: "#4751FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  fingerprintButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Login;
