<template>
  <div id="page">
    <div id="workoutForm">
      <v-select
        v-model="pushExercise"
        v-bind:items="pushCategories"
        label="Push Exercise"
      ></v-select>
      <v-select
        v-model="pullExercise"
        v-bind:items="pullCategories"
        label="Pull Exercise"
      ></v-select>
      <v-select
        v-model="legExercise"
        v-bind:items="legCategories"
        label="Leg Exercise"
      ></v-select>
      <v-text-field
        label="Sets"
        type="number"
        step="1.0"
        v-model.number="sets"
      />
      <v-text-field
        label="Reps"
        type="number"
        step="1.0"
        v-model.number="reps"
      />
      <v-select
        v-model="privacy"
        v-bind:items="privacyCategories"
        label="Privacy"
      ></v-select>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            @click="remove"
            v-bind:disabled="userSelections.length == 0"
            v-on="on"
            >Remove Selection(s)</v-btn
          >
        </template>
        <span>Remove the selected items from the table.</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" @click="yourButtonHandler" v-on="on"
            >Add</v-btn
          >
        </template>
        <span>Add item to the table.</span>
      </v-tooltip>
    </div>

    <p id="one">
      Enter your workout into the form and it will show up in both the "Your
      workouts" table and the "All users workouts" table. Comparing your
      workouts to other users can help you craft a workout routine that best
      suits your needs.
    </p>

    <v-simple-table id="publicTable" fixed-header>
      <div id="th">| Your workouts |</div>
      <table>
        <thead>
          <tr>
            <th id="th">Push Exercise</th>
            <th id="th">Pull Exercise</th>
            <th id="th">Leg Exercise</th>
            <th id="th">Sets</th>
            <th id="th">Reps</th>
            <th id="th">Selection</th>
          </tr>
        </thead>
        <tbody>
          <tr id="dataRows" v-for="(myWorkoutPrivate, pos) in myWorkoutPrivate" :key="pos">
            <td>{{ myWorkoutPrivate.Push }}</td>
            <td>{{ myWorkoutPrivate.Pull }}</td>
            <td>{{ myWorkoutPrivate.Legs }}</td>
            <td id="sets">{{ myWorkoutPrivate.Sets }}</td>
            <td id="reps">{{ myWorkoutPrivate.Reps }}</td>
            <td>
              <input
                type="checkbox"
                v-bind:id="myWorkoutPrivate.mykey"
                v-on:change="selectionHandler"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </v-simple-table>

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
          <tr id="dataRows" v-for="(myWorkoutPublic, pos) in myWorkoutPublic" :key="pos">
            <td>{{ myWorkoutPublic.Push }}</td>
            <td>{{ myWorkoutPublic.Pull }}</td>
            <td>{{ myWorkoutPublic.Legs }}</td>
            <td id="sets">{{ myWorkoutPublic.Sets }}</td>
            <td id="reps">{{ myWorkoutPublic.Reps }}</td>
          </tr>
        </tbody>
      </table>
    </v-simple-table>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";

export default {
  data() {
    return {
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
      privacyCategories: ["Private", "Public"],
      userSelections: [],
      myWorkoutPrivate: [],
      myWorkoutPublic: [],
      pushExercise: "",
      pullExercise: "",
      legExercise: "",
      privacy: "",
      userEmail: "",
      sets: 0,
      reps: 0,
    };
  },

  methods: {
    removeItemPublic(snapshot) {
      /* snapshot.key will hold the key of the item being REMOVED */
      this.myWorkoutPublic = this.myWorkoutPublic.filter(
        z => z.mykey != snapshot.key
      );
      this.userSelections = [];
    },

    removeItemPrivate(snapshot) {
      /* snapshot.key will hold the key of the item being REMOVED */
      this.myWorkoutPrivate = this.myWorkoutPrivate.filter(
        z => z.mykey != snapshot.key
      );
      this.userSelections = [];
    },

    dataHandlerPublic(snapshot) {
      const item = snapshot.val();
      this.myWorkoutPublic.push({ ...item, mykey: snapshot.key });
    },

    dataHandlerPrivate(snapshot) {
      const item = snapshot.val();
      this.myWorkoutPrivate.push({ ...item, mykey: snapshot.key });
    },

    yourButtonHandler() {
      if (this.privacy == "Private") {
        AppDB.ref("workoutPrivate")
          .push()
          .set({
            Push: this.pushExercise,
            Pull: this.pullExercise,
            Legs: this.legExercise,
            Sets: this.sets,
            Reps: this.reps
          });
      } else {
        AppDB.ref("workoutPrivate")
          .push()
          .set({
            Push: this.pushExercise,
            Pull: this.pullExercise,
            Legs: this.legExercise,
            Sets: this.sets,
            Reps: this.reps
          });
        AppDB.ref("workoutPublic")
          .push()
          .set({
            Push: this.pushExercise,
            Pull: this.pullExercise,
            Legs: this.legExercise,
            Sets: this.sets,
            Reps: this.reps
          });
      }
    },

    remove() {
      this.userSelections.forEach(victimKey => {
        AppDB.ref("workoutPrivate")
          .child(victimKey)
          .remove();
      });
      this.userSelections.forEach(victimKey => {
        AppDB.ref("workoutPublic")
          .child(victimKey)
          .remove();
      });
    },

    selectionHandler(changeEvent) {
      const whichKey = changeEvent.target.id;
      if (changeEvent.target.checked) {
        this.userSelections.push(whichKey);
      } else {
        this.userSelections = this.userSelections.filter(function(value) {
          return value != whichKey;
        });
      }
    }
  },
  mounted() {
    AppDB.ref("workoutPrivate").on("child_added", this.dataHandlerPrivate);
    AppDB.ref("workoutPrivate").on("child_removed", this.removeItemPrivate);
    AppDB.ref("workoutPublic").on("child_added", this.dataHandlerPublic);
    AppDB.ref("workoutPublic").on("child_removed", this.removeItemPublic);
  },

  beforeDestroy() {
    AppDB.ref("workoutPrivate").off("child_added", this.dataHandlerPrivate);
    AppDB.ref("workoutPrivate").off("child_removed", this.removeItemPrivate);
    AppDB.ref("workoutPublic").off("child_added", this.dataHandlerPublic);
    AppDB.ref("workoutPublic").off("child_removed", this.removeItemPublic);
  }
};
</script>

<style>
#page {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto;
}

#workoutForm {
  width: 40vw;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 3%;
  grid-column-start: 1;
}

#table {
  width: 60vw;
  height: 335px;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 3%;
  grid-column-start: 2;
}

#publicTable {
  width: 70vw;
  height: 335px;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 3%;
  grid-column-start: 2;
}

#one {
  grid-column-start: 2;
  width: 30vw;
  height: 30vh;
  padding: 2%;
  display: grid;
  margin: 3%;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
}

#th {
  background-color: hsl(204, 57%, 25%);
  color: hsl(204, 57%, 92%);
}

h2 {
  padding: 4%;
}

#amt {
  text-align: right;
}

#total {
  text-align: right;
  font-weight: bold;
}

#dataRows:nth-child(even) {
  background-color: hsl(204, 57%, 56%);
}

#dataRows:nth-child(odd) {
  background-color: hsl(189, 62%, 69%);
}
</style>
