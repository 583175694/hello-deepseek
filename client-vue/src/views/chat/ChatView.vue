<template>
  <div class="app-container">
    <div class="nav-sidebar">
      <div class="logo">
        <n-icon size="24" class="logo-icon">
          <logo-github />
        </n-icon>
        <span class="logo-text">AI 助手</span>
      </div>
      <n-menu
        v-model:value="activeKey"
        :options="menuOptions"
        :collapsed="false"
        :collapsed-width="64"
        :collapsed-icon-size="22"
      />
    </div>
    <div class="main-container">
      <div class="chat-container">
        <div class="chat-sidebar">
          <chat-list />
        </div>
        <div class="chat-main">
          <div class="chat-header">
            <h1>对话</h1>
          </div>
          <div class="chat-content">
            <chat-history />
            <chat-input />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, watch } from "vue";
import { useRouter } from "vue-router";
import { NMenu, NIcon } from "naive-ui";
import { LogoGithub, ChatbubbleEllipses, Book } from "@vicons/ionicons5";
import ChatHistory from "@/components/chat/ChatHistory.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatList from "@/components/chat/ChatList.vue";

const router = useRouter();
const activeKey = ref<string>("chat");

const menuOptions = [
  {
    label: "对话",
    key: "chat",
    icon: renderIcon(ChatbubbleEllipses),
  },
  {
    label: "知识库",
    key: "knowledge",
    icon: renderIcon(Book),
  },
];

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// 监听菜单选择
watch(activeKey, (newKey) => {
  if (newKey === "knowledge") {
    router.push("/knowledge");
  } else {
    router.push("/");
  }
});
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.nav-sidebar {
  width: 64px;
  background: #001529;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-icon {
      color: #fff;
    }

    .logo-text {
      color: #fff;
      margin-left: 8px;
      font-size: 16px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s;
    }
  }

  &:hover {
    width: 200px;

    .logo-text {
      opacity: 1;
    }
  }

  :deep(.n-menu) {
    flex: 1;
    background: transparent;

    .n-menu-item {
      height: 48px;
      color: rgba(255, 255, 255, 0.65);

      &:hover {
        color: #fff;
      }

      &.n-menu-item--selected {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.chat-container {
  height: 100vh;
  display: flex;
  background: #fff;
}

.chat-sidebar {
  width: 260px;
  border-right: 1px solid #eee;
  background: #f9f9f9;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
