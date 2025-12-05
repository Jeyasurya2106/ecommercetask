import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId, total } = route.params || {};

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Order Placed</Text>
        <Text style={styles.text}>
          Your order has been placed successfully.
        </Text>
        {orderId && (
          <Text style={styles.text}>Order ID: #{orderId}</Text>
        )}
        {total && (
          <Text style={styles.text}>Total: ₹{total}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: "Products" }],
          })}
        >
          <Text style={styles.buttonText}>Back to Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: "#e5e7eb",
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 2,
  },
  button: {
    marginTop: 18,
    backgroundColor: "#22c55e",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
});
