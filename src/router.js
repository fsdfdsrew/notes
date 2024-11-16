import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/HomePage.vue';
import Dashboard from './views/DashboardPage.vue';
import { useAuthStoreWithPersistence } from '@/stores/authStore';

const routes = [
    { path: '/', name: 'Home', component: Home },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStoreWithPersistence();
            if (authStore.isAuthenticated) {
                next();
            } else {
                next({ name: 'Home' });
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;