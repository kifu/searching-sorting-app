import React, { useState } from "react";
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
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { auth, db } from "../config/firebaseConfig";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

export default function ChangePasswordScreen({ navigation }: Props) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) {
      Alert.alert("Error", "Password baru dan konfirmasi tidak cocok!");
      return;
    }
    if (newPass.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Error", "User tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      // 1. re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);

      // 2. update password
      await updatePassword(user, newPass);

      // 3. update timestamp in firestore
      await updateDoc(doc(db, "users", user.uid), {
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Sukses", "Password berhasil diubah. Silakan login ulang.");
      await auth.signOut();
      navigation.replace("Auth");
    } catch (error: any) {
      console.log(error);
      let msg = "Gagal mengubah password.";
      if (error.code === "auth/wrong-password")
        msg = "Password saat ini salah.";
      if (error.code === "auth/weak-password") msg = "Password terlalu lemah.";
      Alert.alert("Gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ubah Password</Text>

      <Text style={styles.label}>Password Saat Ini</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPass}
        onChangeText={setCurrentPass}
        placeholder="Masukkan password lama"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Password Baru</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPass}
        onChangeText={setNewPass}
        placeholder="Minimal 6 karakter"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Konfirmasi Password Baru</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPass}
        onChangeText={setConfirmPass}
        placeholder="Ulangi password baru"
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Simpan Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#666" }}>Batal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontWeight: "600", marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  btn: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnBack: { marginTop: 15, alignItems: "center", padding: 10 },
});
