import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import ProductListScreen from "../screens/ProductListScreen";
import CartScreen from "../screens/CartScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // you can show a splash loader if you like
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Products"
              component={ProductListScreen}
              options={{ title: "Pharma Store" }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: "Your Cart" }}
            />
            <Stack.Screen
              name="OrderSuccess"
              component={OrderSuccessScreen}
              options={{ title: "Order Placed", headerBackVisible: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
