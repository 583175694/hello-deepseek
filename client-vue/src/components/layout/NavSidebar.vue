<template>
  <div class="w-[200px] bg-white flex flex-col border-r border-gray-200">
    <div class="h-16 flex items-center px-4 border-b border-gray-200">
      <div class="flex items-center">
        <ChatBubbleLeftEllipsisIcon class="w-6 h-6 text-primary-600" />
        <span class="ml-2 text-base font-medium text-gray-900">AI 助手</span>
      </div>
    </div>
    <nav class="flex-1">
      <div class="px-2 py-2 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.key"
          :to="item.path"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
          :class="[
            item.key === activeKey
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 mr-2 flex-shrink-0"
            :class="[
              item.key === activeKey
                ? 'text-primary-600'
                : 'text-gray-400 group-hover:text-gray-500'
            ]"
          />
          {{ item.label }}
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ChatBubbleLeftEllipsisIcon,
  BookOpenIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const activeKey = ref<string>(router.currentRoute.value.name as string);

const menuItems = [
  {
    label: "对话",
    key: "chat",
    path: "/",
    icon: ChatBubbleLeftEllipsisIcon,
  },
  {
    label: "知识库",
    key: "knowledge",
    path: "/knowledge",
    icon: BookOpenIcon,
  },
];

// 监听路由变化
watch(
  () => router.currentRoute.value.name,
  (newName) => {
    if (newName) {
      activeKey.value = newName as string;
    }
  }
);
</script>

<style scoped lang="scss">
.nav-sidebar {
  width: 200px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;

    .logo-icon {
      color: #333;
    }

    .logo-text {
      color: #333;
      margin-left: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  :deep(.n-menu) {
    flex: 1;
    background: transparent;

    .n-menu-item {
      height: 48px;
      color: #666;

      &:hover {
        color: #333;
      }

      &.n-menu-item--selected {
        color: #333;
        background: #f5f5f5;
      }
    }
  }
}
</style>
