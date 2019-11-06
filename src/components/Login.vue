<template>
    <v-container id="loginForm" v-show="isLoggedIn === false">
        <v-row>
            <v-text-field label="Username/Email" v-model="userEmail" />
        </v-row>
        <v-row>
            <v-text-field type="password" label="Password" v-model="userPassword" />
        </v-row>
        <v-row justify="end">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn @click="doSignUp" v-on="on">SignUp</v-btn>
                    <v-snackbar v-model="snackbar" >{{ text }}
                        <v-btn color="red" @click="snackbar = false" >Close</v-btn>
                    </v-snackbar>
                </template>
                <span>Create an account by entering your preferred email and password.</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn @click="doSignIn" v-on="on">SignIn</v-btn>
                </template>
                <span>Sign into an existing account that you've already created.</span>
            </v-tooltip>
        </v-row>
    </v-container>
</template>

<script>
import { AppAUTH } from "../db-init.js";

export default {
data: function() {
  return {
    userEmail: "",
    userPassword: "",
    isLoggedIn: false,
    snackbar: false,
    text: ""
  }
},

methods: {
    doSignUp() {
        AppAUTH.createUserWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(() => {
            this.$router.push({ path: "/budget" });
        })
        .catch((err) => {
            this.snackbar = true;
            this.text = err;
        });
    },

    doSignIn() {
        AppAUTH.signInWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(() => {
            this.$router.push({ path: "/budget" });
        })
        .catch((err) => {
            this.snackbar = true;
            this.text = err;
        });
    },

},

mounted() {
        AppAUTH.onAuthStateChanged((u) => {
            this.isLoggedIn = u !== null;
        });
}

}
</script>

<style>
#loginForm {
    width: 50vw;
    border-color: grey;
    border-style: solid;
    border-radius: 15px;
    padding: 5%;
    display: grid;
    margin: 2%;
    grid-template-rows: auto auto auto;
}

</style>