import { create } from "zustand";

// Define the store type
type Type = {
  referalCode: string;
  setReferalCode: (referalCode: string) => void;
};

// Create Zustand store with localStorage fetching inside it
const useReferalCode = create<Type>((set) => ({
  referalCode: typeof window !== "undefined" ? localStorage.getItem("refCode") || "" : "", 
  setReferalCode: (referalCode: string) => {
    localStorage.setItem("refCode", referalCode); // Save to localStorage
    set({ referalCode });
  },
}));

export default useReferalCode;