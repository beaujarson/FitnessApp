<template>
  <div id="page">
    <h2>Workout Notes: {{ email }}</h2>
    <br />
    <div id="editor">
      <textarea
        v-model="notes"
        v-on:input="changeHandler"
        placeholder=""
        type="text"
      >
      </textarea>
    </div>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";
import store from "../store.js";
export default {
  store,
  data() {
    return {
      currKey: store.state.key,
      notes: "",
      email: "",
    };
  },
  methods: {
    async changeHandler() {
    var entry;
    await AppDB.ref().child("workoutPublic/" + store.state.key).once('value', function(snapshot) {
      if(snapshot.exists()) {
        entry = true;
      } else {
        entry = false;
      }
    });
    if(entry == true) {
        AppDB.ref().child("workoutPublic/" + store.state.key).update({ Notes: this.notes });
    } else {
      AppDB.ref().child("workoutPrivate/" + store.state.key).update({ Notes: this.notes });
    }
    },
    firebaseUpdateHandler(snapshot) {
      this.notes = snapshot.val();
    }
  },
   async mounted() {
    var entry;
    await AppDB.ref().child("workoutPublic/" + store.state.key).once('value', function(snapshot) {
      if(snapshot.exists()) {
        entry = true;
      } else {
        entry = false;
      }
    });
    if (entry === true) {
      AppDB.ref().child("workoutPublic/" + store.state.key).on("child_changed", this.firebaseUpdateHandler);
      AppDB.ref().child("workoutPublic/" + store.state.key + "/Notes/").once('value').then((snapshot) => this.firebaseUpdateHandler(snapshot));
      AppDB.ref().child("workoutPublic/" + store.state.key + "/Email/").once('value').then((snapshot) => this.email = snapshot.val());
    } 
    else 
    {
      AppDB.ref().child("workoutPrivate/" + store.state.key).on("child_changed", this.firebaseUpdateHandler);
      AppDB.ref().child("workoutPrivate/" + store.state.key + "/Notes/").once('value').then((snapshot) => this.firebaseUpdateHandler(snapshot));
      AppDB.ref().child("workoutPrivate/" + store.state.key + "/Email/").once('value').then((snapshot) => this.email = snapshot.val());
    }
    
  },
  beforeDestroy() {
    const entry = AppDB.ref().child("public/" + store.state.key);
    if (entry != null) {
      entry.off("child_changed", this.firebaseUpdateHandler);
    } else {
      AppDB.ref()
        .child("private/" + store.state.key)
        .off("child_changed", this.firebaseUpdateHandler);
    }
  }
};
</script>

<style>
#editor {
  margin: 0;
  height: 100%;
}
textarea {
  position: absolute;
  top: 80px; /* Header Height */
  bottom: 20px; /* Footer Height */
  width: 90%;
  right: 0;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid lightgray;
  border-radius: 4px;
}
h2 {
  padding: 4%;
}
</style>