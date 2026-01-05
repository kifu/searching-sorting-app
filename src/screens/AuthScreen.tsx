import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { auth, db } from "../config/firebaseConfig";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function AuthScreen({ navigation }: Props) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  // state for loading during manual login/registration
  const [loading, setLoading] = useState<boolean>(false);

  // state for loading when checking auto login session
  const [initializing, setInitializing] = useState<boolean>(true);

  // effect to check whether the user has logged in before
  useEffect(() => {
    // jalan otomatis saat aplikasi dibuka
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // kalau user ditemukan, langsung ke LabScreen
        navigation.replace("Lab");
      } else {
        // kalau belum login, matikan loading dan tampilkan form login
        setInitializing(false);
      }
    });

    // bersihkan listener saat halaman ditutup agar memori lega
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Gagal", "Konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name) {
          Alert.alert("Error", "Nama lengkap harus diisi.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.log("Login Error:", error.code);
      let msg = "Terjadi kesalahan sistem.";

      if (error.code === "auth/invalid-email") {
        msg = "Format email tidak valid.";
      } else if (error.code === "auth/email-already-in-use") {
        msg = "Email ini sudah terdaftar.";
      } else if (error.code === "auth/weak-password") {
        msg = "Password terlalu lemah (minimal 6 karakter).";
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        msg = "Email atau password salah.";
      } else {
        msg = error.message;
      }
      Alert.alert("Gagal", msg);
      setLoading(false);
    }
  };

  // show a clean white screen while checking the login session
  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      ></View>
    );
  }

  // render form login as usual
  return (
    <View style={styles.container}>
      <Text style={styles.title}>searching - sorting</Text>
      <Text style={styles.subtitle}>
        {isLogin
          ? "Masuk ke akun Anda untuk memulai lab."
          : "Buat akun baru untuk memulai lab."}
      </Text>

      {!isLogin && (
        <TextInput
          placeholder="Nama Lengkap"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          placeholder="Masukkan ulang password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? "Masuk" : "Daftar"}</Text>
        )}
      </TouchableOpacity>

      <View style={{ marginTop: 15 }}>
        <Text style={{ textAlign: "center", color: "#000" }}>
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <Text
            style={{ color: "#dc2626", fontWeight: "bold" }}
            onPress={() => {
              setIsLogin(!isLogin);
              setConfirmPassword("");
            }}
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    backgroundColor: "white",
    color: "#000",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
