import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { colores, styles } from "../components/themes/themes";
import IP from "http://localhost:5000";
import { AuthContext } from "../context/UsuarioContext";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);

//   const LOGIN_IMAGE = Image.resolveAssetSource(logInImage).uri;

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${IP}/api/auth/iniciar-sesion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user data in context on successful login
        context.signIn(result.data[0].email, result.data[0].nombre);

        Alert.alert(
          "Inicio de sesión exitoso",
          "Has iniciado sesión exitosamente"
        );
        // Limpiar el formulario después del inicio de sesión exitoso
        setEmail("");
        setPassword("");
        props.navigation.navigate("BottomTab");
      } else {
        Alert.alert(
          "Inicio de sesión fallido",
          "Correo electrónico o contraseña inválidos"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error durante el inicio de sesión");
    }
  };

  return (
    <View style={styles.login_container}>
      <Image source={{ uri: LOGIN_IMAGE }} style={styles.login_image} />
      <Text style={styles.login_texto}>Inicio de Sesión</Text>
      <Text style={styles.login_texto2}>Correo</Text>
      <TextInput
        placeholder="Ingresa tu correo..."
        placeholderTextColor={colores.gris_claro}
        textAlign="center"
        style={styles.login_input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.login_texto2}>Contraseña</Text>
      <TextInput
        placeholder="Ingresa tu contraseña..."
        placeholderTextColor={colores.gris_claro}
        textAlign="center"
        style={styles.login_input}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={{ flex: 1 }} onPress={handleLogin}>
        <View style={styles.login_button}>
          <Text style={styles.login_button_text}>Ingresar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
