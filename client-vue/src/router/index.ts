import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import ChatView from "../views/chat/ChatView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "chat",
    component: ChatView,
  },
  {
    path: "/knowledge",
    name: "knowledge",
    component: () => import("../views/knowledge/KnowledgeView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
