<template>
    <div id="app">
        <v-app>
            <topPage />
            <div id="routedApp">
                <router-view style="width:100%"></router-view>
            </div>
        </v-app>
    </div>
</template>

<script>
    import topPage from './components/topPage.vue'
    import bottomPage from './components/bottomPage.vue'
    export default {
        name: "mainApp",
        components: {
            topPage,
            bottomPage
        }
    }
</script>

<style scoped>
    html {
        overflow-y: hidden;
    }
    #app {
        background-image: url('/image/interface/background.jpg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: top center;
    }
    #routedApp {
        width: available;
        height: 100%;
    }
</style>