import Budget from "@/components/Budget.vue";
import Login from "@/components/Login.vue";
import Editor from "@/components/Editor.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
/* Map path to component */
const routeTable = [
  { path: "/", component: Login },
  { path: "/budget", component: Budget },
  { path: "/editor", component: Editor }
];

const AppRouter = new VueRouter({ routes: routeTable, mode: "history", base: process.env.NODE_ENV === "production"
? "/~milleja1/fitnessApp/"
: "/"});
export { AppRouter };