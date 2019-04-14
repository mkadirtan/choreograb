<template>
    <div id="app">
        <v-toolbar color="grey lighten-4">
            <v-toolbar-items>
                <v-btn href="/" flat>
                    <v-flex>
                        <v-icon color="#000">fas fa-shoe-prints</v-icon>
                        &nbsp;Choreograb
                    </v-flex>
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn href="#" flat>Documentation</v-btn>
                <v-btn href="/app" color="primary">Try Now</v-btn>
                <v-btn to="/mmm" flat>
                    Login with &nbsp;
                    <v-icon color="#3C5A99">fab fa-facebook-square</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <div>asd!!
            <router-view></router-view>
        </div>

            <v-footer
                color="rgba(155,155,155,0.5)"
                absolute
            >
                <v-flex
                        py-3
                        text-xs-center
                        black--text
                >
                    2019 - <strong>Choreograb</strong>
                </v-flex>
            </v-footer>
    </div>
</template>
<script>
    export default {
        methods: {

        },
        data() {
            return {
                activeBtn: 1,
                showNav: false,
            }
        }
    }

</script>
<style>
    html {
        overflow-y: hidden;
    }
    #app {
        background-image: url('/image/interface/background.jpg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: top center;
    }


</style>