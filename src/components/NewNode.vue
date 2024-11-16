<template>
    <div class="modal" role="dialog" aria-labelledby="add-note-title" aria-describedby="add-note-instructions">
        <button @click="closeModal" class="close-button" aria-label="Закрыть окно добавления заметки">
            <img src="@/assets/close.svg" alt="Иконка входа" />
        </button>

        <div class="modal-content">
            <h2 class="text-autosize">Добавление заметки</h2>

            <div class="row">
                <div class="input-group">
                    <p>Название заметки</p>
                    <input id="title" placeholder="Введите название" maxlength="100" v-model="title_input"/>
                    <p class="char-counter">{{ title_input.length }}/100</p>
                </div>
                <div class="input-group">
                  <p for="password">Текст заметки</p>
                  <textarea id="multiline-input" class="input-content" placeholder="Введите текст" maxlength="500" v-model="content_input"/>
                  <p class="char-counter">{{ content_input.length }}/500</p>
                </div>
            </div>

            <div class="button-container">
                <button @click="addNote" class="add-note-button" aria-label="Добавить заметку" title="Добавить заметку">Добавить</button>
            </div>

            <div v-if="error" class="error-message">
              <p v-for="(msg, index) in error" :key="index">{{ msg }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { useAuthStoreWithPersistence } from '@/stores/authStore';
import { useNotesStore } from '@/stores/notesStore';

  export default {
    data() {
    return {
        content_input: "",
        title_input: "",
        error: [],
      };
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
        async addNote() {
          const authStore = useAuthStoreWithPersistence(); // Доступ к хранилищу
          const token = authStore.token;

          if (!token) {
            this.error = ["Необходима авторизация"];
            return;
          }

          const payload = {
            title: this.title_input,
            content: this.content_input,
          };

          try {
            const response = await axios.post(
              'https://dist.nd.ru/api/notes', 
              payload, 
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
              console.log('Заметка успешно создана:', response.data);
              this.$emit('noteAdded', response.data);
              this.closeModal();

              // Получение обновленного списка заметок
              const getResponse = await axios.get('https://dist.nd.ru/api/notes', {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (getResponse.status === 200) {
                const notesStore = useNotesStore();
                notesStore.notes = getResponse.data;
                console.log(getResponse.data);
              }
            }
          } catch (error) {
            console.error("Ошибка при создании заметки:", error);
            if (error.response && error.response.data && error.response.data.message) {
              this.error = Array.isArray(error.response.data.message)
              ? error.response.data.message
              : [error.response.data.message];
            } else {
              this.error = ["Ошибка сети или сервера"];
            }
          }
          
          
        },
    }
  };
</script>
  
<style>
.input-content {
    width: 100%;
    padding: 16px 28px;
    font-size: 18px;
    line-height: 28px;
    color: var(--dark);
    box-sizing: border-box;
    border-radius: 36px;
    resize: none;
}

.input-content::placeholder {
    font-size: 18px;
    line-height: 28px;
    color: var(--gray);
}

.input-content:hover {
    border-color: var(--green-light);
    border-width: 2px;
}

.input-content:focus {
    border-color: var(--green-light);
    border-width: 2px;
    outline: none;
}

.char-counter {
    text-align: right;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.add-note-button {
    padding: 12px 24px;
    background: var(--green-light);
    border-radius: 32px;
    font-weight: 500;
    font-size: 20px;
    color: white;
    border: none;
    cursor: pointer;
    text-align: center;
}

.input-content {
    height: 244px;
}



@media (max-width: 768px) {
  .modal {
    width: 90%;
    height: auto;
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
}
</style>
  