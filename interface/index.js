import Vue from 'vue';
import './vuetify';
import './vue_axios';
import router from './router';
import './image_importer';
import mainApp from './mainApp.vue';

new Vue({
    router,
    render: h => h(mainApp)
}).$mount("#app");