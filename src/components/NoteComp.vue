<template>
    <div class="note-comp" role="region" aria-labelledby="note-title" aria-describedby="note-content">
        <h4 class="note-title">{{ title }}</h4>

        <p class="text-normal">{{ content }}</p>

        <button class="delete-button" @click="deleteNote" aria-label="Удалить заметку">
            <img src="@/assets/close.svg" alt="Удалить" class="delete-icon" />
            <p class="text-normal">Удалить</p>
        </button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useAuthStoreWithPersistence } from '@/stores/authStore';
  import { useNotesStore } from '@/stores/notesStore';

  export default {
    name: "NoteComp",
    props: {
        id: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            default: "",
        },
    },
    methods: {
        async deleteNote() {
            const authStore = useAuthStoreWithPersistence();
            const token = authStore.token;

            if (!token) {
                console.error("Необходима авторизация для удаления заметки.");
            return;
            }

            try {
                // Отправляем DELETE-запрос на сервер
                const response = await axios.delete(
                `https://dist.nd.ru/api/notes/${this.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
                );

                if (response.status === 200) {
                    console.log('Заметка успешно удалена:', response.data);

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
                if (error.response && error.response.status === 404) {
                    console.error("Заметка не найдена.");
                } else if (error.response && error.response.status === 401) {
                  console.error("Необходима авторизация.");
                } else {
                    console.error("Ошибка при удалении заметки:", error);
                }
            }

            //this.$emit("delete", this.id); // Отправляем событие на родительский компонент
        },
    },
  };
</script>
  
<style scoped>
.note-comp {
  position: relative;
  width: 100%;
  min-width: 388px;
  background-color: var(--light-background, var(--green-light));
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  display: grid;
  grid-template-rows: min-content;
  height: min-content;

  /* Создание кастомной формы с отсеченным углом */
  clip-path: polygon(
    0% 100%,
    100% 100%,
    100% 40px,
    calc(100% - 40px) 0%,
    0% 0%
  );
}

.note-comp::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: var(--light-background, var(--green));
  
  clip-path: polygon(
    0 0,
    100% 100%,
    0 100%
    );
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  border-bottom-left-radius: 15px;
}

.note-comp h4{
    margin: 0;
    padding: 28px 0 0 28px;
}

.note-comp p{
    padding: 20px 28px;
}

.note-title {
    width: 75%;
}

.delete-button {
    right: 0;
    bottom: 0;
    background: none;
    border: none;
    color: var(--white);

    display: flex;
    align-items: center;
    gap: 12px;

    cursor: pointer;

    margin: 8px;
    align-items: baseline;
    justify-content: end;
}
</style>