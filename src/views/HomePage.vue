<template>
    <div class="home">
      <header class="dashboard-header" role="banner">
        <div class="header-div">
            <picture>
                <source srcset="@/assets/logo.svg" media="(max-width: 360px)" />
                <img src="@/assets/logo-text.svg" alt="MyNotes" />
            </picture>
            <button class="login-button" @click="openLogin" aria-label="Войти в систему">
                <img class="login-icon" src="@/assets/login_icon.svg" alt="Иконка входа" />
                Вход
            </button>
        </div>
      </header>

      <main class="content" role="main">
        <section class="text-block">
            <h1 class="title">Мои<br>заметки</h1>
            <h3 class="description">Не забывай о важном,<br>храни его в облаке.</h3>
        </section>

        <section class="image-block" aria-labelledby="image-block">
            <img src="@/assets/notes-image.png" alt="Изображение" />
        </section>
        </main>

        <div v-if="isLoginOpen || isRegistrationOpen" class="overlay" aria-hidden="true"></div>

        <LoginModal v-if="isLoginOpen" @close="closeModal" @openRegistration="openRegistrationModal" ref="modal-login" aria-labelledby="login-modal"/>

        <RegistrationModal v-if="isRegistrationOpen" @close="closeModal" @openLogin="openLoginModal" ref="modal-reg" aria-labelledby="registration-modal"/>
    </div>
</template>
  
<script>
import LoginModal from '../components/LoginModal.vue';
import RegistrationModal from '@/components/RegistrationModal.vue';

    export default {
        name: 'HomePage',
        data() {
            return {
                isLoginOpen: false,
                isRegistrationOpen: false,
            };
        },
        components: {
            LoginModal,
            RegistrationModal,
        },
        mounted() {
            document.body.style.overflow = '';
        },
        methods: {
            openLogin() {
                this.isLoginOpen = true;
                document.body.style.overflow = 'hidden';
            },
            closeModal() {
                this.isLoginOpen = false;
                this.isRegistrationOpen = false;
                document.body.style.overflow = '';
            },
            openRegistrationModal() {
                this.isRegistrationOpen = true;
                this.isLoginOpen = false;
                document.body.style.overflow = 'hidden';
            },
            openLoginModal() {
                this.isRegistrationOpen = false;
                this.isLoginOpen = true;
                document.body.style.overflow = '';
            },
        }
    };
</script>
  
<style scoped>
    .login-button{
        width: 144px;
        height: 56px;
        background: var(--green-light);
        border-radius: 32px;

        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: white;

        border: none;
        cursor: pointer;
    }

    .content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 5%;
        align-items: center;
        justify-items: center;
    }

    .image-block img {
        width: 100%;
        max-width: 100%;
    }

    .title {
        font-size: clamp(60px, calc(8.82vw + 23.7px), 104px);
        line-height: clamp(60px, calc(8.82vw + 23.7px), 104px);
    }

    .description {
        font-size: clamp(18px, calc(2.82vw + 8px), 32px);
        line-height: clamp(24px, calc(4vw + 10px), 48px);
    }

    @media (max-width: 768px) {
        .content {
            grid-template-columns: 1fr;
        }

        .text-block {
            text-align: center;
        }
    }

    @media (max-width: 360px) {
        .title {
            font-style: normal;
            font-weight: 900;
            font-size: 60px;
            line-height: 64px;
        }
    }
</style>