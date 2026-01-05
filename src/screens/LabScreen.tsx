import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { RootStackParamList, COLORS } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Lab">;
const SCREEN_WIDTH = Dimensions.get("window").width;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- algorithm descriptions ---
const DESCRIPTIONS: any = {
  sorting: {
    bubble:
      "Bubble Sort adalah algoritma pengurutan sederhana yang berulang kali menelusuri daftar, membandingkan elemen yang berdekatan dan menukarnya jika urutannya salah. Penelusuran diulang hingga daftar tersebut diurutkan.",
    selection:
      "Selection Sort membagi daftar menjadi dua bagian: terurut dan tidak terurut. Algoritma ini berulang kali menemukan elemen minimum dari bagian yang tidak terurut dan memindahkannya ke akhir bagian yang terurut.",
    insertion:
      "Insertion Sort membangun array yang diurutkan satu per satu. Algoritma ini mengambil satu elemen dari data yang belum diurutkan dan memasukkannya ke posisi yang benar di bagian yang sudah terurut.",
  },
  searching: {
    linear:
      "Linear Search adalah metode pencarian sekuensial. Ia secara berurutan memeriksa setiap elemen dalam daftar sampai elemen target ditemukan atau seluruh daftar telah diperiksa.",
    binary:
      "Binary Search adalah algoritma pencarian efisien yang bekerja pada array terurut. Ia membandingkan elemen target dengan elemen tengah, dan jika tidak sama, setengah bagian di mana target tidak mungkin ada akan dieliminasi.",
  },
};

export default function LabScreen({ navigation }: Props) {
  // --- state ---
  const [array, setArray] = useState<number[]>([]);
  const [barColors, setBarColors] = useState<string[]>([]);
  const [size, setSize] = useState<number>(15);
  const [speed, setSpeed] = useState<number>(500);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Siap memulai...");
  const [creationDate, setCreationDate] = useState<string>("-");

  // category & algorithm selection
  const [category, setCategory] = useState<"sorting" | "searching">("sorting");
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [searchValue, setSearchValue] = useState<string>("");

  const shouldStop = useRef<boolean>(false);

  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // --- effect : fetch user data ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.createdAt) {
              const dateObj = data.createdAt.toDate
                ? data.createdAt.toDate()
                : new Date(data.createdAt);
              const day = dateObj.getDate().toString().padStart(2, "0");
              const month = (dateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = dateObj.getFullYear();
              setCreationDate(`${day}/${month}/${year}`);
            }
          }
        }
      } catch (e) {
        console.log("Error fetch user:", e);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    resetArray();
  }, [size, category]);

  useEffect(() => {
    if (category === "sorting") setAlgorithm("bubble");
    else setAlgorithm("linear");
  }, [category]);

  const resetArray = () => {
    if (isRunning) return;
    const newArray: number[] = [];
    const usedNumbers = new Set<number>();
    while (newArray.length < size) {
      const num = Math.floor(Math.random() * 100) + 1;
      if (!usedNumbers.has(num)) {
        newArray.push(num);
        usedNumbers.add(num);
      }
    }
    setArray(newArray);
    setBarColors(new Array(size).fill(COLORS.default));
    setStatusText("Array direset.");
    shouldStop.current = false;
  };

  const getCurrentDelay = () => 1050 - speedRef.current;

  // --- algorithms (sorting & searching logic) ---
  const bubbleSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (shouldStop.current) return;
        setStatusText(`Cek ${arr[j]} & ${arr[j + 1]}`);
        let colors = new Array(n).fill(COLORS.default);
        for (let k = n - i; k < n; k++) colors[k] = COLORS.sorted;
        colors[j] = COLORS.compare;
        colors[j + 1] = COLORS.compare;
        setBarColors([...colors]);

        await sleep(getCurrentDelay());

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          colors[j] = COLORS.swap;
          colors[j + 1] = COLORS.swap;
          setBarColors([...colors]);
          await sleep(getCurrentDelay());
        }
      }
    }
    setBarColors(new Array(n).fill(COLORS.sorted));
  };

  const selectionSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (shouldStop.current) return;
        setStatusText(`Cari min... Bandingkan ${arr[minIdx]} & ${arr[j]}`);
        let colors = new Array(n).fill(COLORS.default);
        for (let k = 0; k < i; k++) colors[k] = COLORS.sorted;
        colors[i] = COLORS.pivot;
        colors[minIdx] = COLORS.pivot;
        colors[j] = COLORS.compare;
        setBarColors([...colors]);
        await sleep(getCurrentDelay());
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        setStatusText(`Tukar ${arr[i]} dengan min baru ${arr[minIdx]}`);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        let colors = new Array(n).fill(COLORS.default);
        for (let k = 0; k < i; k++) colors[k] = COLORS.sorted;
        colors[i] = COLORS.swap;
        colors[minIdx] = COLORS.swap;
        setBarColors([...colors]);
        await sleep(getCurrentDelay());
      }
    }
    setBarColors(new Array(n).fill(COLORS.sorted));
  };

  const insertionSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setStatusText(`Ambil ${key} untuk disisipkan`);
      let colors = new Array(n).fill(COLORS.default);
      colors[i] = COLORS.pivot;
      setBarColors([...colors]);
      await sleep(getCurrentDelay());
      while (j >= 0 && arr[j] > key) {
        if (shouldStop.current) return;
        setStatusText(`Geser ${arr[j]} ke kanan`);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        colors = new Array(n).fill(COLORS.default);
        colors[j] = COLORS.compare;
        colors[j + 1] = COLORS.swap;
        setBarColors([...colors]);
        await sleep(getCurrentDelay());
        j = j - 1;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setStatusText(`Sisipkan ${key}`);
      colors = new Array(n).fill(COLORS.default);
      colors[j + 1] = COLORS.sorted;
      setBarColors([...colors]);
      await sleep(getCurrentDelay());
    }
    setBarColors(new Array(n).fill(COLORS.sorted));
  };

  const linearSearch = async (arr: number[], target: number) => {
    for (let i = 0; i < arr.length; i++) {
      if (shouldStop.current) return;
      setStatusText(`Cek indeks ${i}: Nilai ${arr[i]}`);
      let colors = new Array(arr.length).fill(COLORS.default);
      colors[i] = COLORS.compare;
      setBarColors([...colors]);
      await sleep(getCurrentDelay());
      if (arr[i] === target) {
        setStatusText(`Ketemu! ${target} ada di indeks ${i}`);
        colors[i] = COLORS.sorted;
        setBarColors([...colors]);
        return;
      }
    }
    setStatusText(`Nilai ${target} tidak ditemukan.`);
  };

  const binarySearch = async (arr: number[], target: number) => {
    setStatusText("Sorting array dulu untuk Binary Search...");
    arr.sort((a, b) => a - b);
    setArray([...arr]);
    await sleep(1000);
    let low = 0,
      high = arr.length - 1;
    while (low <= high) {
      if (shouldStop.current) return;
      let mid = Math.floor((low + high) / 2);
      setStatusText(`Cari range ${low}-${high}. Tengah: ${mid} (${arr[mid]})`);
      let colors = new Array(arr.length).fill(COLORS.default);
      for (let i = low; i <= high; i++) colors[i] = COLORS.compare;
      colors[mid] = COLORS.pivot;
      setBarColors([...colors]);
      await sleep(getCurrentDelay());
      if (arr[mid] === target) {
        setStatusText(`Ketemu! ${target} ada di indeks ${mid}`);
        colors[mid] = COLORS.sorted;
        setBarColors([...colors]);
        return;
      } else if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    setStatusText(`Nilai ${target} tidak ditemukan.`);
  };

  // --- control handler ---
  const handleStart = async () => {
    if (isRunning) {
      shouldStop.current = true;
      setIsRunning(false);
      setStatusText("Dihentikan.");
      return;
    }
    setIsRunning(true);
    shouldStop.current = false;

    let currentArray = [...array];
    try {
      if (category === "sorting") {
        if (algorithm === "bubble") await bubbleSort(currentArray);
        else if (algorithm === "selection") await selectionSort(currentArray);
        else if (algorithm === "insertion") await insertionSort(currentArray);
      } else {
        const target = parseInt(searchValue);
        if (isNaN(target)) {
          Alert.alert("Input Error", "Masukkan angka yang ingin dicari!");
          setIsRunning(false);
          return;
        }
        if (algorithm === "linear") await linearSearch(currentArray, target);
        else if (algorithm === "binary")
          await binarySearch(currentArray, target);
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (!shouldStop.current) setIsRunning(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Auth");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>searching - sorting</Text>
          <Text style={styles.username}>
            Selamat datang,{" "}
            <Text style={{ fontWeight: "bold", color: "black" }}>
              {auth.currentUser?.displayName}
            </Text>
            !
          </Text>
          <Text style={styles.dateText}>Akun Dibuat: {creationDate}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>Ubah Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.headerBtn, { backgroundColor: "#fee2e2" }]}
          >
            <Text style={[styles.headerBtnText, { color: "#dc2626" }]}>
              Keluar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* visualization */}
      <View style={styles.visualizerContainer}>
        {array.map((value, index) => {
          const itemWidth = (SCREEN_WIDTH - 30) / size;
          const showText = size <= 20;
          return (
            <View
              key={index}
              style={{
                height: "100%",
                width: itemWidth,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {showText && (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 2,
                    width: "150%",
                    textAlign: "center",
                  }}
                >
                  {value}
                </Text>
              )}
              <View
                style={{
                  backgroundColor: barColors[index] || COLORS.default,
                  width: itemWidth - 2,
                  height: `${value}%`,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                }}
              />
            </View>
          );
        })}
      </View>

      {/* status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {/* controls & description */}
      <ScrollView
        style={styles.controls}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(val) => setCategory(val)}
                enabled={!isRunning}
                style={styles.picker}
                dropdownIconColor="#000"
              >
                <Picker.Item label="Sorting" value="sorting" />
                <Picker.Item label="Searching" value="searching" />
              </Picker>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.label}>Algoritma</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={algorithm}
                onValueChange={(val) => setAlgorithm(val)}
                enabled={!isRunning}
                style={styles.picker}
                dropdownIconColor="#000"
              >
                {category === "sorting"
                  ? [
                      <Picker.Item key="1" label="Bubble" value="bubble" />,
                      <Picker.Item
                        key="2"
                        label="Selection"
                        value="selection"
                      />,
                      <Picker.Item
                        key="3"
                        label="Insertion"
                        value="insertion"
                      />,
                    ]
                  : [
                      <Picker.Item key="4" label="Linear" value="linear" />,
                      <Picker.Item key="5" label="Binary" value="binary" />,
                    ]}
              </Picker>
            </View>
          </View>
        </View>

        {category === "searching" && (
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Nilai yang Dicari</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 42"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={searchValue}
              onChangeText={setSearchValue}
              editable={!isRunning}
            />
          </View>
        )}

        <View style={styles.controlGroup}>
          <Text style={styles.label}>Ukuran Data: {size}</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={5}
            maximumValue={50}
            step={1}
            value={size}
            onSlidingComplete={setSize}
            disabled={isRunning}
            minimumTrackTintColor="#333"
            thumbTintColor="#333"
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>Kecepatan: {speed}ms</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={50}
            maximumValue={1000}
            value={speed}
            onSlidingComplete={setSpeed}
            minimumTrackTintColor="#333"
            thumbTintColor="#333"
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnReset]}
            onPress={resetArray}
            disabled={isRunning}
          >
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, isRunning ? styles.btnStop : styles.btnStart]}
            onPress={handleStart}
          >
            <Text style={styles.btnText}>
              {isRunning ? "Hentikan" : "Mulai"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* algorithm description */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>Deskripsi Algoritma</Text>
          <Text style={styles.descText}>
            {DESCRIPTIONS[category]?.[algorithm] || "Deskripsi belum tersedia."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  username: { fontSize: 16, color: "#333", marginTop: 5 },
  dateText: { fontSize: 12, color: "#666", marginTop: 2 },
  headerBtn: { padding: 8, backgroundColor: "#f3f4f6", borderRadius: 5 },
  headerBtnText: { color: "#333", fontSize: 12, fontWeight: "600" },
  visualizerContainer: {
    height: 220,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: 10,
  },
  statusContainer: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  statusText: { fontSize: 12, fontStyle: "italic", color: "#333" },
  controls: { padding: 20 },
  controlGroup: { marginBottom: 15 },
  row: { flexDirection: "row", marginBottom: 15 },
  label: { fontWeight: "600", marginBottom: 5, fontSize: 12 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    color: "#000",
  },
  picker: {
    color: "#000",
    backgroundColor: "#fff",
  },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: { padding: 15, borderRadius: 8, flex: 1, alignItems: "center" },
  btnReset: { backgroundColor: "#6b7280" },
  btnStart: { backgroundColor: "#000" },
  btnStop: { backgroundColor: "#dc2626" },
  btnText: { color: "white", fontWeight: "bold" },

  descCard: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  descText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
