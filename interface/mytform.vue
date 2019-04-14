<template>
    <v-app>
        <v-layout row>
            <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
            >
                <v-text-field
                        ref="name"
                        v-model="name"
                        :counter="10"
                        :rules="nameRules"
                        label="Name"
                        required
                ></v-text-field>

                <v-text-field
                        ref="email"
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                ></v-text-field>

                <v-text-field
                        ref="username"
                        v-model="username"
                        :rules="usernameRules"
                        label="Username"
                        required
                ></v-text-field>

                <v-text-field
                        ref="password"
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        required
                ></v-text-field>

                <v-text-field
                        ref="password2"
                        v-model="password2"
                        :rules="password2Rules"
                        label="Re-enter Password"
                        required
                ></v-text-field>

                <v-btn
                        :disabled="!valid"
                        color="success"
                        @click="validate"
                >
                    Validate
                </v-btn>
                <v-btn
                        color="error"
                        @click="reset"
                >
                    Reset Form
                </v-btn>
                <v-btn
                        color="success"
                        @click="serialization"
                >
                    Serialization
                </v-btn>
            </v-form>
        </v-layout>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            valid: true,
            name: 'myform',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters'
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            username: 'username',
            usernameRules: [
                v => v.length <= 4
            ],
            password: '',
            passwordRules: [],
            password2: '',
            password2Rules: [],
            userId: 'empty'
        }),
        methods: {
            serialization(){
                this.axios.post('/console', {
                    user: {
                        id: this.$data.userId
                    }
                }).then(res=>{console.log(res)});
            },
            validate () {
                        this.axios.post('/login', {
                            username: this.$refs.username.value,
                            password: this.$refs.password.value
                        }).then(res=>{
                    console.log(res);
                    this.$data.userId = res.data;
                });
            },
            reset () {
                this.axios.post('/register', {
                    email: this.$refs.email.value,
                    name: this.$refs.name.value,
                    username: this.$refs.username.value,
                    password: this.$refs.password.value,
                    password2: this.$refs.password2.value
                }).then(response=>{console.log(response)});
            }
        }
    }
</script>

<style scoped>

</style>