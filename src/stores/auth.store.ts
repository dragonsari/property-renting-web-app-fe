import { data } from "motion/react-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "USER" | "TENANT";

type AuthState = {
  token: string | null;
  role: Role | null;
  isVerified: boolean;
  setAuth: (data: Partial<AuthState>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set)=>({
      token: null,
      role: null,
      isVerified:false,

      setAuth:(data)=>
        set((state)=>({
          ...state,
          ...data,
        })),

      logout:()=>{
        set({token:null, role:null, isVerified: false});
      },
    }),
    {
      name:"auth-storage",
    }
  )
);
