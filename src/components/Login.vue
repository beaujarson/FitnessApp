<template>
<div id="page">
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
    <v-container>
    <v-simple-table id="publicTable" fixed-header>
    <table>
      <thead>
        <tr>
        <th id="th">Push Exercise</th>
        <th id="th">Pull Exercise</th>
        <th id="th">Leg Exercise</th>
        <th id="th">Sets</th>
        <th id="th">Reps</th>
        <th id="th">Selection</th></tr>
      </thead>
      <tbody>
        <tr id="dataRows" v-for="(myWorkout,pos) in myWorkout" :key="pos">
          <td>{{ myWorkout.Push }}</td>
          <td>{{ myWorkout.Pull }}</td>
          <td>{{ myWorkout.Legs }}</td>
          <td id="sets">{{ myWorkout.Sets }}</td>
          <td id="reps">{{ myWorkout.Reps }}</td>
          <td><input type="checkbox" v-bind:id="myWorkout.mykey" v-on:change="selectionHandler" /></td>
        </tr>
      </tbody>
    </table>
  </v-simple-table>
    </v-container>
</div>
</template>

<script>
import { AppAUTH } from "../db-init.js";
import { AppDB } from "../db-init.js";

export default {
data: function() {
  return {
    userEmail: "",
    userPassword: "",
    isLoggedIn: false,
    snackbar: false,
    text: "",
    pushCategories : ["Bench press", "Shoulder press", "Chest-Fly", "Triceps", "Push-ups"],
    pullCategories : ["Row", "Pull-ups", "Pull-downs", "Shrug", "Dead lift"],
    legCategories : ["Squat", "Romanian deadlift", "Lunge", "Calf-raises", "Leg press"],
    userSelections : [],
    myWorkout: [],
    pushExercise: "",
    pullExercise: "",
    legExercise: "",
    sets: 0,
    reps: 0
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

    dataHandler(snapshot) {
      const item = snapshot.val();
      this.myWorkout.push({...item, mykey: snapshot.key});
    },

},

mounted() {
    AppDB.ref("workoutPublic").on("child_added", this.dataHandler);
    // AppDB.ref("workoutPublic").on("child_removed", this.removeExpenseItem);
        AppAUTH.onAuthStateChanged((u) => {
            this.isLoggedIn = u !== null;
        });
}

//   beforeDestroy() {
//     AppDB.ref("workoutPublic").off("child_added", this.dataHandler);
//     AppDB.ref("workoutPublic").off("child_removed", this.removeExpenseItem);
//   }

}
</script>

<style>
#page {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto auto;
}

#loginForm {
    width: 40vw;
    border-color: grey;
    border-style: solid;
    border-radius: 15px;
    padding: 10%;
    display: grid;
    margin: 2%;
    grid-template-rows: auto auto auto;
}

#publicTable {
    width: 50vw;
    height: 300px;
    border-color: grey;
    border-style: solid;
    border-radius: 15px;
    padding: 2%;
    display: grid;
    margin: 2%;
    grid-column-start: 2;
}


</style>