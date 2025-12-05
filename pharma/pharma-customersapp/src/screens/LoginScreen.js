import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />

      <View style={styles.card}>
        <Text style={styles.title}>Pharma Care</Text>
        <Text style={styles.subtitle}>
          Sign in to order your medicines & health essentials.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[styles.button, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Use the credentials you registered on the backend.
        </Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.85)",
  },
  card: {
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#0b1120",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e7eb",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  error: {
    marginTop: 10,
    fontSize: 12,
    color: "#fecaca",
    backgroundColor: "#7f1d1d",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  field: {
    marginTop: 14,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingHorizontal: 12,
    color: "#e5e7eb",
    backgroundColor: "#020617",
    fontSize: 14,
  },
  button: {
    marginTop: 18,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "600",
  },
  hint: {
    marginTop: 10,
    fontSize: 11,
    textAlign: "center",
    color: "#6b7280",
  },
});
