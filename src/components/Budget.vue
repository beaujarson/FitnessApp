<template>
  <div id="page">
    <h2>Workout App</h2>
      <div id="expenseform">
        <v-date-picker v-model="expenseDate" />
        <v-text-field label="Description" type="text" v-model="expenseDesc" />
        <v-select
          v-model="expenseCategory"
          v-bind:items="expenseCategories"
          label="Category"
        ></v-select>
        <v-text-field label="Amount" type="number" step="0.01" v-model.number="expenseAmt" />
        <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" @click="remove" v-bind:disabled="userSelections.length == 0" v-on="on">Remove Selection(s)</v-btn>
                </template>
                <span>Remove the selected items from the table.</span>
        </v-tooltip>
        <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" @click="yourButtonHandler" v-on="on">Add</v-btn>
                </template>
                <span>Add item to the table.</span>
        </v-tooltip>
      </div>
<div id="table">
  <v-simple-table fixed-header height="300px" >
    <table>
      <thead>
        <tr>
        <th id="th">Date of Workout</th>
        <th id="th">Description of Workout</th>
        <th id="th">Cateogry</th>
        <th id="th">Reps</th>
        <th id="th">Selection</th></tr>
      </thead>
      <tbody>
        <tr id="dataRows" v-for="(myExpense,pos) in myExpense" :key="pos">
          <td>{{ myExpense.date }}</td>
          <td>{{ myExpense.description }}</td>
          <td>{{ myExpense.category }}</td>
          <td id="amt">{{ myExpense.amount.toFixed(2) }}</td>
          <td><input type="checkbox" v-bind:id="myExpense.mykey" v-on:change="selectionHandler" /></td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td id="total">Total</td>
          <td id="amt">{{ totalExpense.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </v-simple-table>
  </div>
  </div>
  
</template>

<script scoped>
import { AppDB } from "../db-init.js";


  export default {
  data() {
    return {
      expenseCategories : ["Arms","Legs","Back","Cardio","Abs", "Other"],
      userSelections : [],
      myExpense: [],
      totalExpense: 0,
      expenseAmt: 0,
      expenseDesc: "",
      expenseDate: "",
      expenseCategory: ""
    };
  },

  methods: {
    dataHandler(snapshot) {
      const item = snapshot.val();
      this.myExpense.push({ ...item, mykey: snapshot.key });

      // accumulate the total
      this.totalExpense += item.amount;
    },

    removeExpenseItem(snapshot) {
      /* snapshot.key will hold the key of the item being REMOVED */
      this.myExpense = this.myExpense.filter(z => z.mykey != snapshot.key);
      this.totalExpense = 0;
      this.myExpense.forEach(h => { this.totalExpense += h.amount
      });
      this.userSelections = [];
    },

    yourButtonHandler() {
      AppDB.ref("budget")
      .push()
      .set({
      description: this.expenseDesc,
      amount: this.expenseAmt,
      category: this.expenseCategory,
      date: this.expenseDate,
      });
    },

    remove() {
      this.userSelections.forEach((victimKey) => {
        AppDB.ref("budget")
        .child(victimKey)
        .remove();
    });
    },

    selectionHandler (changeEvent) {
    const whichKey = changeEvent.target.id;
    if (changeEvent.target.checked) {
        this.userSelections.push(whichKey);
    } else {
        this.userSelections = this.userSelections.filter(function(value) {
                return value != whichKey;
        })
    }
  },
  },
  mounted() {
    AppDB.ref("budget").on("child_added", this.dataHandler);
    AppDB.ref("budget").on("child_removed", this.removeExpenseItem);
  },

  beforeDestroy() {
    AppDB.ref("budget").off("child_added", this.dataHandler);
    AppDB.ref("budget").off("child_removed", this.removeExpenseItem);
  }
  
}
</script>

<style>
#page {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto auto;
}

#expenseform {
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
    width: 50vw;
    height: 335px;
    border-color: hsl(204, 9%, 62%);
    border-style: solid;
    border-radius: 15px;
    padding: 2%;
    display: grid;
    margin: 3%;
    grid-column-start: 2;
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