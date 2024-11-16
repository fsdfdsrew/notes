import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
    }),

    actions: {
        setToken(newToken) {
            this.token = newToken;
        },
        setUser(user) {
            this.user = user;
        },
        clearToken() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        },
        loadAuthFromLocalStorage() {
            const savedToken = localStorage.getItem('authToken');
            const savedUser = localStorage.getItem('authUser');
            if (savedToken) this.token = savedToken;
            if (savedUser) this.user = JSON.parse(savedUser);
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        getEmail: (state) => state.user?.email,
    },
});

// Наблюдатель для сохранения токена и пользователя при каждом изменении
import { watch } from 'vue';

export const useAuthStoreWithPersistence = () => {
    const authStore = useAuthStore();

    watch(
        () => authStore.token,
        (newToken) => {
            if (newToken) {
                localStorage.setItem('authToken', newToken);
            }
        }
    );

    watch(
        () => authStore.user,
        (newUser) => {
            if (newUser) {
                localStorage.setItem('authUser', JSON.stringify(newUser));
            }
        }
    );

    // Загружаем данные из localStorage при инициализации
    authStore.loadAuthFromLocalStorage();

    return authStore;
};