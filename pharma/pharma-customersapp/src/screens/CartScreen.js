import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderService";

export default function CartScreen({ navigation }) {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [address, setAddress] = useState("Chennai, Tamil Nadu");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!items.length) {
      Alert.alert("Cart is empty", "Add some items to your cart first.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Address required", "Please enter a shipping address.");
      return;
    }
    setLoading(true);
    try {
      const result = await createOrder(items, address);
      clearCart();
      navigation.replace("OrderSuccess", {
        orderId: result.orderId,
        total: result.total,
      });
    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>₹{item.product.price}</Text>
      </View>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() =>
            updateQuantity(item.product.id, item.quantity - 1)
          }
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() =>
            updateQuantity(item.product.id, item.quantity + 1)
          }
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.product.id)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.product.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No items in cart.</Text>
        }
        contentContainerStyle={
          items.length ? null : { flex: 1, justifyContent: "center" }
        }
      />

      <View style={styles.footer}>
        <Text style={styles.label}>Shipping Address</Text>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderButton, loading && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.orderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  itemPrice: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  qtyValue: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  removeButton: {
    paddingHorizontal: 8,
  },
  removeText: {
    fontSize: 16,
    color: "#ef4444",
  },
  footer: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  addressInput: {
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 60,
    fontSize: 13,
    color: "#0f172a",
  },
  summaryRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
  },
  orderButton: {
    marginTop: 12,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  orderText: {
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "600",
  },
});
