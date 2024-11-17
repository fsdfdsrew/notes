<template>
  <div class="modal" role="dialog" aria-labelledby="modal-title">
    <button @click="closeModal" class="round-button" aria-label="Закрыть модальное окно">
      <img src="@/assets/close.svg" alt="Иконка закрытия окна" />
    </button>

    <div class="modal-content">
      <h2 class="text-autosize">Вход в ваш аккаунт</h2>

      <div class="row">

        <InputField 
          title="Email"
          id="email"
          type="email"
          v-model="email"
          placeholder="Введите ваш email"
          aria-describedby="email-helper"
        />

        <InputField 
          title="Пароль"
          id="password"
          type="password"
          v-model="password"
          placeholder="Введите ваш пароль"
          aria-describedby="password-helper"
        />

      </div>

      <div div class="row">
        <div class="link-and-button">
          <div class="registration-link">
            <p class="text-link-resize">У вас нет аккаунта? <a href="#" @click.prevent="openRegistration" aria-label="Перейти на страницу регистрации">Зарегистрируйтесь</a></p>
          </div>
          <button @click="login" class="log-reg-button" aria-label="Войти в систему">Войти</button>
        </div>

        <div v-if="error.length > 0" class="error-message" role="alert" aria-live="assertive">
          <p>{{ error }}</p>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStoreWithPersistence } from '@/stores/authStore';
import { useNotesStore } from '@/stores/notesStore';
import { handleErrorResponse } from '@/services/errorHandler';

import InputField from '@/components/InputField.vue';

export default {
  data() {
    return {
      email: "",
      password: "",
      error: [],
      isPasswordVisible: false,
      user: null
    };
  },

  components: {
      InputField
  },

  mounted() {
    this.checkTokenAndAuthenticate();
  },
  
  setup() {
    const router = useRouter();
    return { router };
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },

    async checkTokenAndAuthenticate() {
      const authStore = useAuthStoreWithPersistence();
      const token = authStore.token;

      if (token) {
        try {
          const userResponse = await axios.get('https://dist.nd.ru/api/auth', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          authStore.setUser(userResponse.data);
          console.log("User loaded from token:", userResponse.data);

          const notesResponse = await axios.get('https://dist.nd.ru/api/notes', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const notesStore = useNotesStore();
          notesStore.notes = notesResponse.data;
          console.log("Notes loaded:", notesResponse.data);

          this.router.push({ name: 'Dashboard' });
        } catch (error) {
          console.error("Token verification failed:", error);
          authStore.clearToken();
          authStore.clearUser();
          console.log("Invalid token, user needs to log in.");
        }
      } else {
        console.log("No token found, user needs to log in.");
      }
    },

    async login() {
      try {
        const response = await axios.post('https://dist.nd.ru/api/auth', {
          email: this.email,
          password: this.password,
        });

        const token = response.data.accessToken;

        const authStore = useAuthStoreWithPersistence();
        authStore.setToken(token);

        console.log("Token saved to store:", authStore.token);
        this.error = [];

        // Авторизация
        const userResponse = await axios.get('https://dist.nd.ru/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.error = [];

        authStore.setUser(userResponse.data);

        console.log("User saved to store:", userResponse.data.email);

        // Получение списка заметок

        const notesResponse = await axios.get('https://dist.nd.ru/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const notesStore = useNotesStore();
        notesStore.notes = notesResponse.data;
        console.log(notesResponse.data);

        // Переход на страницу Dashboard
        this.router.push({ name: 'Dashboard' });

      } catch (error) {
        this.error = handleErrorResponse(error);
      }
    },

    openRegistration() {
      this.$emit('openRegistration');
    }
  },
};
</script>