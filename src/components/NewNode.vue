<template>
    <div class="modal" role="dialog" aria-labelledby="add-note-title" aria-describedby="add-note-instructions">
        <button @click="closeModal" class="round-button" aria-label="Закрыть окно добавления заметки">
            <img src="@/assets/close.svg" alt="Иконка входа" />
        </button>

        <div class="modal-content">
            <h2 class="text-autosize">Добавление заметки</h2>

            <div class="row">
              <InputField 
                title="Введите название"
                id="title"
                type="email"
                v-model="title_input"
                maxLength="100"
                placeholder="Введите название"
                aria-describedby="email-helper"
              />

              <InputField
                title="Текст заметки"
                id="note-text"
                v-model="content_input"
                placeholder="Введите текст заметки"
                :maxLength="500"
                textarea
                aria-describedby="note-helper"
              />
            </div>

            <div class="button-container">
                <button @click="addNote" class="log-reg-button" aria-label="Добавить заметку" title="Добавить заметку">Добавить</button>
            </div>

            <div v-if="error.length > 0" class="error-message">
              <p>{{ error }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { useAuthStoreWithPersistence } from '@/stores/authStore';
import { useNotesStore } from '@/stores/notesStore';
import { handleErrorResponse } from '@/services/errorHandler';

import InputField from '@/components/InputField.vue';

  export default {
    data() {
    return {
        content_input: "",
        title_input: "",
        error: [],
      };
    },
    components: {
      InputField
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
            const response = await axios.post('https://dist.nd.ru/api/notes', payload, {
              headers: { Authorization: `Bearer ${token}` }
            });

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
            this.error = handleErrorResponse(error);
          }
        },
    }
  };
</script>
  
<style>
.button-container {
    display: flex;
    justify-content: flex-end;
}
</style>
  