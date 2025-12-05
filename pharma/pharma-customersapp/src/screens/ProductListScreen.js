import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getProducts } from "../api/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, items } = useCart();
  const { logout, user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.log("Products load error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        {item.Category && (
          <Text style={styles.category}>{item.Category.name}</Text>
        )}
        <Text style={styles.desc} numberOfLines={2}>
          {item.description || "No description"}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.stock}>
            {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          item.stock <= 0 && { backgroundColor: "#9ca3af" },
        ]}
        disabled={item.stock <= 0}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addText}>
          {item.stock <= 0 ? "Out" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Welcome, {user?.name || "Customer"}</Text>
          <Text style={styles.subtitle}>Order your medicines easily</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cartBadge}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.cartText}>Cart ({items.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 12,
  },
  header: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  cartBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    marginBottom: 4,
  },
  cartText: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: "600",
  },
  logout: {
    fontSize: 11,
    color: "#ef4444",
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  category: {
    fontSize: 11,
    color: "#3b82f6",
    marginTop: 2,
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16a34a",
  },
  stock: {
    fontSize: 11,
    color: "#6b7280",
  },
  addButton: {
    alignSelf: "center",
    marginLeft: 10,
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addText: {
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
