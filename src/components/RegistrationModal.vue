<template>
    <div class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
        <button @click="closeModal" class="round-button" aria-label="Закрыть модальное окно">
            <img src="@/assets/close.svg" alt="Иконка закрытия окна" />
        </button>

        <div class="modal-content">
            <h2 class="text-autosize">Регистрация</h2>

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

                <InputField 
                  title="Пароль ещё раз"
                  id="passwordAgain"
                  type="password"
                  v-model="passwordAgain"
                  placeholder="Введите ваш пароль"
                  aria-describedby="password-again-helper"
                />
            </div>

            <div div class="link-and-button">
                <div class="login-link">
                    <p class="text-link-resize">У вас есть аккаунт? <a href="#" @click.prevent="openLogin" aria-label="Перейти на страницу входа">Войдите</a></p>
                </div>
                <button @click="register" class="log-reg-button" aria-label="Зарегистрироваться">Зарегистрироваться</button>
            </div>

            <div v-if="error.length > 0" class="error-message" role="alert" aria-live="assertive">
              <p>{{ error }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { useRouter } from "vue-router";
import { useAuthStoreWithPersistence } from "@/stores/authStore";
import { useNotesStore } from "@/stores/notesStore";
import { handleErrorResponse } from '@/services/errorHandler';

import InputField from '@/components/InputField.vue';

  export default {
    data() {
    return {
        email: "",
        password: "",
        passwordAgain: "",
        error: [],
        isPasswordVisible: false,
        isPasswordVisibleAgain: false,
      };
    },
    components: {
      InputField
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        openLogin() {
            this.$emit('openLogin');
        },
        togglePasswordVisibility() {
          this.isPasswordVisible = !this.isPasswordVisible;
        },
        togglePasswordVisibilityAgain() {
          this.isPasswordVisibleAgain = !this.isPasswordVisibleAgain;
        },
        async register() {
          console.log("Email:", this.email);
          console.log("Password:", this.password);
          console.log("Confirm Password:", this.passwordAgain);

          if (this.password !== this.passwordAgain) {
            this.error = "Пароли не совпадают.";
            return;
          }

          const payload = {
            email: this.email,
            password: this.password,
            confirm_password: this.passwordAgain,
          };

          try {
            const response = await axios.post('https://dist.nd.ru/api/reg', payload);
            
            if (response.status === 200) {
              console.log('Регистрация успешна:', response.data);
              
              // Авторизация после регистрации
              const loginResponse = await axios.post("https://dist.nd.ru/api/auth", {
                email: this.email,
                password: this.password,
              });

              const token = loginResponse.data.accessToken;
              const authStore = useAuthStoreWithPersistence();
              authStore.setToken(token);

              console.log("Token saved");
              this.error = [];

              const userResponse = await axios.get("https://dist.nd.ru/api/auth", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
              });

              authStore.setUser(userResponse.data);
              console.log("User saved");

              // Получение заметок
              const notesResponse = await axios.get("https://dist.nd.ru/api/notes", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const notesStore = useNotesStore();
              notesStore.notes = notesResponse.data;
              console.log(notesResponse.data);

              // Переход на страницу Dashboard
              this.router.push({ name: "Dashboard" });
            }
          } catch (error) {
            this.error = handleErrorResponse(error);
          }
        },
    }
  };
</script>