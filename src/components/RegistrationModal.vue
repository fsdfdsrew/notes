<template>
    <div class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
        <button @click="closeModal" class="close-button" aria-label="Закрыть модальное окно">
            <img src="@/assets/close.svg" alt="Иконка закрытия окна" />
        </button>

        <div class="modal-content">
            <h2 class="text-autosize">Регистрация</h2>

            <div class="row">
                <div class="input-group">
                    <p for="email">Email</p>
                    <input type="email" id="email" placeholder="Введите ваш email" v-model="email" aria-describedby="email-helper"/>
                </div>
                <div class="input-group">
                  <p for="password">Пароль</p>
                  <div class="password-container">
                    <input :type="isPasswordVisible ? 'text' : 'password'" id="password" placeholder="Введите ваш пароль" v-model="password" aria-describedby="password-helper"/>
                    <button @click="togglePasswordVisibility" class="password-toggle" aria-label="Показать/скрыть пароль">
                      <img
                      :src="isPasswordVisible ? require('@/assets/off-password.svg') : require('@/assets/on-password.svg')"
                      alt="Toggle password visibility"
                      class="eye-icon"
                      />
                    </button>
                  </div>
                </div>
                <div class="input-group">
                    <p for="password">Пароль ещё раз</p>
                    <div class="password-container">
                      <input :type="isPasswordVisibleAgain ? 'text' : 'password'" id="passwordAgain" placeholder="Введите ваш пароль" v-model="passwordAgain" aria-describedby="password-again-helper"/>
                      <button @click="togglePasswordVisibilityAgain" class="password-toggle" aria-label="Показать/скрыть пароль">
                        <img
                        :src="isPasswordVisibleAgain ? require('@/assets/off-password.svg') : require('@/assets/on-password.svg')"
                        alt="Toggle password visibility"
                        class="eye-icon"
                        />
                      </button>
                    </div>
                </div>
            </div>

            <div div class="login-link-and-button">
                <div class="login-link">
                    <p class="text-link-resize">У вас есть аккаунт? <a href="#" @click.prevent="openLogin" aria-label="Перейти на страницу входа">Войдите</a></p>
                </div>
                <button @click="register" class="reg-button" aria-label="Зарегистрироваться">Зарегистрироваться</button>
            </div>

            <div v-if="error" class="error-message" role="alert" aria-live="assertive">
              <p v-for="(msg, index) in error" :key="index">{{ msg }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { useRouter } from "vue-router";
import { useAuthStoreWithPersistence } from "@/stores/authStore";
import { useNotesStore } from "@/stores/notesStore";

  export default {
    data() {
    return {
        email: "",
        password: "",
        passwordAgain: "",
        error: "",
        isPasswordVisible: false,
        isPasswordVisibleAgain: false,
      };
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
              this.error = "";

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
            console.error("Error during registration:", error);
            if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
              this.error = error.response.data.message
            } else if (error.response && error.response.data && error.response.data.message) {
              this.error = [error.response.data.message];
            } else {
              this.error = "Ошибка сети или сервера"; // Общая ошибка
            }

          }
        },
    }
  };
</script>
  
<style>
.login-link-and-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.login-link a{
  text-decoration: none;
  color: var(--green-light);
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: clamp(5px, 3vw, 18px);
  line-height: 28px;
}

.reg-button {
  width: 100%;
  max-width: 267px;
  height: 56px;
  background: var(--green-light);
  border-radius: 32px;
  font-weight: 500;
  font-size: 20px;
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
}

@media (max-width: 768px) {
  .modal {
    width: 90%;
    height: auto;
    padding: 56px;
  }

  .modal-content {
    grid-template-rows: auto auto auto;
  }
}

@media (max-width: 360px) {
  .modal {
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  
  .modal-content {
    gap: 16px;
    grid-template-rows: auto min-content auto;
  }
  
  .modal-content h2 {
    font-weight: 600;
    font-size: 32px;
    line-height: 36px;
    align-self: end;
  }

  .login-link-and-button {
    flex-direction: column-reverse;
    justify-content: space-evenly;
  }

  .reg-button {
    max-width: 100%;
    margin-bottom: 12px;
  }

  .login-link {
    text-align: center;
  }
}
</style>
  