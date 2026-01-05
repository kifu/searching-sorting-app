// tipe untuk navigasi
export type RootStackParamList = {
  Auth: undefined;
  Lab: undefined;
  ChangePassword: undefined;
};

// tipe data user
export interface UserData {
  name: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

// warna visualisasi
export const COLORS = {
  default: "#333333",
  compare: "#DC2626",
  swap: "#D97706",
  sorted: "#059669",
  pivot: "#0000FF",
};
