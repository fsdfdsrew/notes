import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref([]);

    function loadNotesFromLocalStorage() {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            notes.value = JSON.parse(storedNotes);
        }
    }

    function saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes.value));
    }

    function clearNotes() {
        notes.value = [];  // Очистить заметки
        localStorage.removeItem('notes');  // Удалить заметки из localStorage
    }

    loadNotesFromLocalStorage();

    watch(notes, saveNotesToLocalStorage, { deep: true });

    return {
        notes,
        loadNotesFromLocalStorage,
        clearNotes,
    };
});