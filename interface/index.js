import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import mytform from './mytform.vue';
import crazycarousel from './header2.vue';

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

new Vue({el: '#app', components: {crazycarousel}, template: '<crazycarousel/>'});