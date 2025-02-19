<template>
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
</template>

<script setup lang="ts">
import { ref, h, watch } from "vue";
import { useRouter } from "vue-router";
import { NMenu, NIcon } from "naive-ui";
import { LogoGithub, ChatbubbleEllipses, Book } from "@vicons/ionicons5";

const router = useRouter();
const activeKey = ref<string>(router.currentRoute.value.name as string);

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
