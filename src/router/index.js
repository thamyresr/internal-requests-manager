import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import RequestFormView from "../views/RequestFormView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginView },
    { path: "/dashboard", name: "dashboard", component: DashboardView },
    { path: "/requests/new", name: "request-new", component: RequestFormView },
    { path: "/requests/:id/edit", name: "request-edit", component: RequestFormView, props: true },
  ],
});

export default router;
