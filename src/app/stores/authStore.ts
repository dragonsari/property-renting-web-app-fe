import {create} from "zustand";

interface IAuthStore {
    email : string;
    isLoggedIn : boolean;
    role : string;

    onLogin : (email:string, role:string) => void;
    onLogout : () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
    email : '',
    isLoggedIn : false,
    role : '',

    onLogin : (email:string, role:string) => set(() => ({
        email,
        isLoggedIn : true,
        role,
    })),
    onLogout : () => set(() => ({
        email : '',
        isLoggedIn : false,
        role : '',
    })),
}));
export default useAuthStore;