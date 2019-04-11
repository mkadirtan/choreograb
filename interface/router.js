import Vue from "vue";
import Router from "vue-router";
import trialPage from './components/trial-page.vue';
import myApp from './myApp.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/trial-page',
            component: trialPage
        }
    ],
    mode: "history"
});

