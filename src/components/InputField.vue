<template>
  <div class="input-group">
    <!-- Название для Input -->
    <p :for="id" v-if="title">{{ title }}</p>
    <div class="input-container">

      <!-- TextArea если передано isTextarea -->
      <textarea
        v-if="isTextarea"
        :id="id"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :aria-describedby="ariaDescribedby"
        class="textarea-field"
      ></textarea>

      <!-- Input -->
      <input 
        v-else
        :type="inputType"
        :id="id"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)" 
        :aria-describedby="ariaDescribedby"
      />

      <!-- Кнопка скрытия/показа пароля -->
      <button v-if="isPassword" @click="togglePasswordVisibility" class="password-toggle" aria-label="Показать/скрыть пароль">
        <img
          :src="isPasswordVisible ? require('@/assets/off-password.svg') : require('@/assets/on-password.svg')"
          alt="Toggle password visibility"
          class="eye-icon"
        />
      </button>
    </div>

    <p class="char-counter" v-if="maxLength">{{ modelValue.length }}/{{ maxLength }}</p>

  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    title: String,
    id: String,
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: String,
    maxLength: {
      type: Number,
      required: false
    },
    textarea: {
      type: Boolean,
      default: false,
    },
    ariaDescribedby: String,
  },
  data() {
    return {
      inputValue: this.value,
      isPasswordVisible: false
    };
  },
  computed: {
    inputType() {
      if (this.type === 'password' && this.isPasswordVisible) {
        return 'text';
      }
      return this.type;
    },
    isPassword() {
      return this.type === 'password';
    },
    isTextarea() {
      return this.textarea;
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  },
  watch: {
    inputValue(newVal) {
      this.$emit('update:value', newVal);
    }
  }
};
</script>

<style scoped>

/* Input */
.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.input-group input {
  width: 100%;
  border-radius: 36px;
  height: 72px;
  padding-left: 28px;
  padding-right: 28px;
  font-size: 18px;
  line-height: 28px;
  color: var(--dark);
  box-sizing: border-box;
}

.input-group input::placeholder {
    font-size: 18px;
    line-height: 28px;
    color: var(--gray);
}

.input-group input:hover {
    border-color: var(--green-light);
    border-width: 2px;
}

.input-group input:focus {
    border-color: var(--green-light);
    border-width: 2px;
    outline: none;
}

.input-group p {
    margin-bottom: 8px;
    margin-left: 24px;
}

/* TextArea */
.textarea-field {
    font-family: 'Montserrat';
    width: 100%;
    padding: 16px 28px;
    font-size: 18px;
    line-height: 28px;
    color: var(--dark);
    box-sizing: border-box;
    border-radius: 36px;
    resize: none;
    height: 244px;
}

.textarea-field::placeholder {
    font-size: 18px;
    line-height: 28px;
    color: var(--gray);
}

.textarea-field:hover {
  border-color: var(--green-light);
  border-width: 2px;
}

.textarea-field:focus {
    border-color: var(--green-light);
    border-width: 2px;
    outline: none;
}

/* ---- */
.password-toggle {
  background: transparent;
  border: none;
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.char-counter {
    text-align: right;
}
</style>