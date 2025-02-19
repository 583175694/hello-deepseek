<template>
  <div class="app-container">
    <nav-sidebar />
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
import ChatHistory from "@/components/chat/ChatHistory.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatList from "@/components/chat/ChatList.vue";
import NavSidebar from "@/components/layout/NavSidebar.vue";
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
