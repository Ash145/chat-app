import { create } from "zustand"

export const useAuthStore = create((set) => ({
    authUser: { name: "Ashik", role: "Junior Full Stack Developer" },
    isLoggedIn: false,
    login: () => {
        console.log("Logged In");
        set((state) => ({
            isLoggedIn: true,
            authUser: { ...state.authUser, role: "Full Stack Developer" }
        }));
    }
}));