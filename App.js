import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Dashboard from "./src/screens/dashboard";
import Profile from "./src/screens/profile";
import Settings from "./src/screens/settings";
import ReporteForm from "./src/screens/reporte-form";
import Login from "./src/screens/login";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Inicio") {
            iconName = "home";
          } else if (route.name === "Perfil") {
            iconName = "user";
          } else if (route.name === "Ajustes") {
            iconName = "settings";
          } else if (route.name === "Reporte") {
            iconName = "file-text";
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00205B",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={Dashboard} />
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen name="Ajustes" component={Settings} />
      <Tab.Screen name="Reporte" component={ReporteForm} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
