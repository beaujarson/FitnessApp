<template>
  <div id="page">
    <v-container id="loginForm" v-show="isLoggedIn === false">
      <v-row>
        <v-text-field label="Username/Email" v-model="email" />
      </v-row>
      <v-row>
        <v-text-field type="password" label="Password" v-model="userPassword" />
      </v-row>
      <v-row justify="end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="doSignUp" v-on="on">SignUp</v-btn>
            <v-snackbar v-model="snackbar"
              >{{ text }}
              <v-btn color="red" @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </template>
          <span
            >Create an account by entering your preferred email and
            password.</span
          >
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="doSignIn" v-on="on">SignIn</v-btn>
          </template>
          <span
            >Sign into an existing account that you've already created.</span
          >
        </v-tooltip>
      </v-row>
    </v-container>

    <p id="one">
      The table below shows all users workouts entered into the YouFit App. To
      enter your workout information in, log in and enter your workout into the
      form on the next page.
    </p>

    <v-container>
      <v-simple-table id="publicTable" fixed-header>
        <div id="th">| All users workouts |</div>
        <table>
          <thead>
            <tr>
              <th id="th">Push Exercise</th>
              <th id="th">Pull Exercise</th>
              <th id="th">Leg Exercise</th>
              <th id="th">Sets</th>
              <th id="th">Reps</th>
            </tr>
          </thead>
          <tbody>
            <tr id="dataRows" v-for="(myWorkout, pos) in myWorkout" :key="pos">
              <td>{{ myWorkout.Push }}</td>
              <td>{{ myWorkout.Pull }}</td>
              <td>{{ myWorkout.Legs }}</td>
              <td id="sets">{{ myWorkout.Sets }}</td>
              <td id="reps">{{ myWorkout.Reps }}</td>
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
import store from "../store.js";

export default {
  data: function() {
    return {
      email: "",
      userPassword: "",
      isLoggedIn: false,
      snackbar: false,
      text: "",
      pushCategories: [
        "Bench press",
        "Shoulder press",
        "Chest-Fly",
        "Triceps",
        "Push-ups"
      ],
      pullCategories: ["Row", "Pull-ups", "Pull-downs", "Shrug", "Dead lift"],
      legCategories: [
        "Squat",
        "Romanian deadlift",
        "Lunge",
        "Calf-raises",
        "Leg press"
      ],
      userSelections: [],
      myWorkout: [],
      pushExercise: "",
      pullExercise: "",
      legExercise: "",
      sets: 0,
      reps: 0,
    };
  },

  methods: {
    doSignUp() {
      AppAUTH.createUserWithEmailAndPassword(this.email, this.userPassword)
        .then(() => {
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          this.snackbar = true;
          this.text = err;
        });
        store.state.setUserEmail(this.email);
    },

    doSignIn() {
      AppAUTH.signInWithEmailAndPassword(this.email, this.userPassword)
        .then(() => {
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          this.snackbar = true;
          this.text = err;
        });
        store.state.setUserEmail(this.email);
    },

    dataHandler(snapshot) {
      const item = snapshot.val();
      this.myWorkout.push({
        Email: this.email,
        ...item,
        mykey: snapshot.key
      });
    }
  },

  mounted() {
    AppDB.ref("workoutPublic").on("child_added", this.dataHandler);
    AppAUTH.onAuthStateChanged(u => {
      this.isLoggedIn = u !== null;
    });
  },

  beforeDestroy() {
    AppDB.ref("workoutPublic").off("child_added", this.dataHandler);
  }
};
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
  width: 100%;
  height: 300px;
  border-color: grey;
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 2%;
  grid-column-start: 2;
}

#one {
  width: 40vw;
  height: 30vh;
  padding: 2%;
  display: grid;
  margin: 3%;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  grid-column-start: 2;
}
</style>
