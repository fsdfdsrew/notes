<template>
    <div class="dashboard">
      <header class="dashboard-header" aria-label="Главная панель управления">
        <div class="header-div">
          <picture @click="goToHome" style="cursor: pointer;">
            <source srcset="@/assets/logo.svg" media="(max-width: 360px)" />
            <img src="@/assets/logo-text.svg" alt="MyNotes" />
          </picture>


          <div class="profile-container" role="navigation" aria-label="Профиль пользователя">
            <p aria-label="Электронная почта пользователя">{{ user?.email || "e-mail@mail.mail" }}</p>
            <div lass="profile">
              <button class="profile-button" @click="toggleMenu" aria-expanded="isMenuOpen" aria-haspopup="menu" title="Открыть меню пользователя">
                <img src="@/assets/user.svg" alt="Открыть меню профиля" />
              </button>

              <div v-if="isMenuOpen" class="profile-menu-wrapper">
                  <div class="triangle" aria-hidden="true"></div>
                  <div class="profile-menu" aria-label="Окно выхода">
                  <button class="logout-button" @click="logout" role="menuitem" title="Выйти из системы">Выйти</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="notes" aria-label="Список заметок">
        <div class="note-container">
            <NoteComp
            v-for="note in notes"
            :key="note.id"
            :id="note.id"
            :title="note.title"
            :content="note.content"
            @delete="deleteNote"
            aria-label="Заметка"
            />
        </div>
      </div>

      <button @click="openNewNode" class="add-button" aria-label="Добавить новую заметку" title="Добавить новую заметку">
            <img src="@/assets/plus.svg" alt="Добавить заметку" />
      </button>

      <div v-if="isNewNodeOpen" class="overlay" aria-hidden="true"></div>
      <NewNode v-if="isNewNodeOpen" @close="closeModal" ref="modal-new-node"/>

    </div>
  </template>
  
<script>
import { useAuthStoreWithPersistence } from '@/stores/authStore';
import { useNotesStore } from '@/stores/notesStore';

import NoteComp from "@/components/NoteComp.vue";
import NewNode from "@/components/NewNode.vue";

  export default {
    name: 'DashboardPage',
    components: {
      NoteComp,
      NewNode,
    },
    data() {
      return {
        isMenuOpen: false,
        isNewNodeOpen: false,
      };
    },

    mounted() {
      document.body.style.overflow = '';
    },

    computed: {
      user() {
        const authStore = useAuthStoreWithPersistence();
        return authStore.user;
      },
      notes() {
        const notesStore = useNotesStore();
        return notesStore.notes;
      },
    },

    methods: {
      createNote() {
        alert("Создание заметки");
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      openNewNode() {
        this.isNewNodeOpen = true;
        document.body.style.overflow = 'hidden';
      },
      closeModal() {
        this.isNewNodeOpen = false;
        document.body.style.overflow = '';
      },
      logout() {
        const authStore = useAuthStoreWithPersistence();
        const notesStore = useNotesStore();

        authStore.clearToken();
        notesStore.clearNotes();

        this.$router.push({ name: 'Home' });
      },
      deleteNote(id) {
        console.log(id);
        this.notes = this.notes.filter((note) => note.id !== id);
      },

      goToHome() {
        this.$router.push({ name: 'Home' });
      }
    }
  };
  </script>
  
<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}







.profile-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile {
  position: relative;
}

.profile-container p {
  font-size: clamp(12px, 1.5vw, 18px);
}

.profile-button {
  height: 56px;
  width: 56px;
  border-radius: 32px;
  background: var(--dark-middle);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.profile-button img {
  width: 60%;
}

.profile-menu-wrapper {
  position: absolute;
  transform: translateX(110%) translateY(12px);
  z-index: 100;
}

.triangle {
  position: relative;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid var(--dark-middle); /* Цвет треугольника */
}

.profile-menu {
  position: absolute;
  background-color: var(--dark-middle);
  border-radius: 8px;
  padding: 40px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: -1px;
  transform: translateX(-60%);
  z-index: 0;
  box-shadow: 0px 15px 46px -10px rgba(0, 0, 0, 0.6);
}

.logout-button {
  background: transparent;
  border: none;
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  color: var(--green-light);
  cursor: pointer;
}

.notes {
  width: calc(100% - ((100vw - 388px) * 0.05263));
}

.note-container {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(388px, 1fr));
  gap: calc(2vw + 10px);
  justify-items: center;

  grid-auto-rows: min-content;
}

.add-button {
  position: fixed;
  right: clamp(8px, calc(3.53vw - 27px), 40px);
  bottom: 40px;
  height: 56px;
  width: 56px;
  border-radius: 32px;
  background: var(--green-light);
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 15px 46px -10px rgba(0, 0, 0, 0.6);
}

.add-button:hover {
    background: var(--green-middle);
}

.add-button:active {
    background: var(--green-dark);
}

@media (max-width: 360px) {
  .profile-container p{
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  }

  .profile-button {
    height: 36px;
    width: 36px;
  }

  .profile-menu {
    padding: 50%;
  }

  .notes {
    width: 100%;
  }

  .note-container {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }

  .note-comp {
    min-width: 100%;
  }
}
</style>