<template>
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
            <v-btn v-on:click="myFunction" flat>Documentation</v-btn>
            <v-btn v-bind:to="switchTrial()" color="primary">Try Now</v-btn>
            <v-btn href="/auth/facebook" flat>
                Login with &nbsp;
                <v-icon color="#3C5A99">fab fa-facebook-square</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
    export default {
        methods:{
            myFunction: function(){
                this.axios.post('/getUserInformation').then((user)=>{
                    console.log(user.data);
                })
            },
            switchTrial: function(){
                if(this.$route.path === '/trial-page'){
                    return '/'
                }
                else return '/trial-page'
            }
        },
        data() {
            return {

            }
        }
    }
</script>