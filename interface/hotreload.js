import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import myApp from './myApp.vue';

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

//new Vue({el: '#app', components: {crazycarousel}, template: '<crazycarousel/>'});
export default new Vue({el: '#app', components: {myApp}, template: '<myApp/>'});

import './hotreload';

if (module.hot) {
    module.hot.accept('./hotreload', function(){
        window.location.reload(true)
    })
}