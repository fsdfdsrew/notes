<template>
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
    <button @click="closeModal" class="close-button" aria-label="Закрыть модальное окно">
      <img src="@/assets/close.svg" alt="Иконка закрытия окна" />
    </button>

    <div class="modal-content">
      <h2 class="text-autosize">Вход в ваш аккаунт</h2>

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
      </div>

      <div div class="row">
        <div class="link-and-error">
          <div class="registration-link">
            <p class="text-link-resize">У вас нет аккаунта? <a href="#" @click.prevent="openRegistration" aria-label="Перейти на страницу регистрации">Зарегистрируйтесь</a></p>
          </div>
          <button @click="login" class="login-button" aria-label="Войти в систему">Войти</button>
        </div>

        <div v-if="error" class="error-message" role="alert" aria-live="assertive">
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

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      isPasswordVisible: false,
      user: null
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
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
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
        this.error = "";

        // Авторизация
        const userResponse = await axios.get('https://dist.nd.ru/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.error = "";

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
        if (error.response && error.response.data && error.response.data.message) {
        // Проверяем, если сообщение об ошибке — это массив, берем только первое сообщение
        this.error = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]  // Берем только первое сообщение
          : error.response.data.message;
        } else {
          console.log(error);
          this.error = "Ошибка авторизации";
        }
      }
    },

    openRegistration() {
      this.$emit('openRegistration');
    }
  },
};
</script>
  

<style scoped>
.eye-icon {
  width: 24px;
  height: 24px;
}

.link-and-error {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.registration-link a{
  text-decoration: none;
  color: var(--green-light);
  font-style: normal;
  font-weight: 700;
  font-size: clamp(5px, 3vw, 18px);
  line-height: 28px;
}

.login-button {
  width: 100%;
  max-width: 114px;
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

.login-button:hover {
  background: var(--green-middle);
}

.login-button:active {
  background: var(--green-dark);
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
    gap: 28px;
    grid-template-rows: auto min-content auto;
  }
  
  .modal-content h2 {
    font-weight: 600;
    font-size: 32px;
    line-height: 36px;
    align-self: end;
  }

  .link-and-error {
    flex-direction: column-reverse;
  }

  .login-button {
    max-width: 100%;
    margin-bottom: 12px;
  }

  .registration-link {
    text-align: center;
  }
}
</style>