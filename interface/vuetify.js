import Vue from "vue";
import Vuetify from "vuetify";
import '@fortawesome/fontawesome-free/js/all';
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify, {
    theme: {
        primary: "#ee44aa",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
    },
    iconfont: "md", //using material design
    icons: {
        notification: "notification_important",
        success: "check",
        error: "error"
    }
});
