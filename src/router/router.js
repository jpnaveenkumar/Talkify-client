import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/chat.vue';
import ErrorPage from '../views/ErrorPage.vue';
const router = new VueRouter({
    routes:[
        {
            path: '/',
            component: Home
        },
        {
            path: '/chat/:channel',
            name: 'chat',
            props: true,
            component: Chat
        },
        {
            path: '*',
            name: 'ErrorPage',
            component: ErrorPage
        }
    ]
});
export default router;