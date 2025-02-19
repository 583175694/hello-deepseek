<template>
  <div class="chat-list">
    <div class="header">
      <n-button type="primary" @click="showCreateDialog = true">
        新建会话
      </n-button>
    </div>
    <div class="sessions">
      <div
        v-for="session in chatStore.sessions"
        :key="session.sessionId"
        class="session-item"
        :class="{
          active: chatStore.currentSession?.sessionId === session.sessionId,
        }"
        @click="handleSessionClick(session)"
      >
        <div class="session-info">
          <div class="title">{{ session.roleName || "新会话" }}</div>
          <div class="last-message">
            {{ session.lastMessage || "暂无消息" }}
          </div>
        </div>
        <n-button
          circle
          type="error"
          size="tiny"
          @click.stop="handleDeleteSession(session)"
        >
          <template #icon>
            <n-icon><trash-icon /></n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <n-modal v-model:show="showCreateDialog">
      <n-card title="新建会话" style="width: 600px">
        <n-form ref="formRef" :model="formModel">
          <n-form-item label="角色名称" path="roleName">
            <n-input
              v-model:value="formModel.roleName"
              placeholder="请输入角色名称"
            />
          </n-form-item>
          <n-form-item label="系统提示词" path="systemPrompt">
            <n-input
              v-model:value="formModel.systemPrompt"
              type="textarea"
              placeholder="请输入系统提示词"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreateDialog = false">取消</n-button>
            <n-button type="primary" @click="handleCreateSession"
              >确定</n-button
            >
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NButton,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NIcon,
} from "naive-ui";
import { Trash as TrashIcon } from "@vicons/ionicons5";
import { useChatStore } from "@/stores/chat";
import { chatApi } from "@/api/chat";
import type { Session } from "@/types/chat";

const chatStore = useChatStore();
const showCreateDialog = ref(false);
const formModel = ref({
  roleName: "",
  systemPrompt: "",
});

onMounted(async () => {
  try {
    chatStore.setLoading(true);
    const { sessions } = await chatApi.getSessions();
    chatStore.setSessions(sessions);
  } catch (error) {
    chatStore.setError(
      error instanceof Error ? error.message : "获取会话列表失败"
    );
  } finally {
    chatStore.setLoading(false);
  }
});

const handleSessionClick = async (session: Session) => {
  try {
    chatStore.setLoading(true);
    chatStore.setCurrentSession(session);
    const { messages } = await chatApi.getMessages(session.sessionId);
    chatStore.setMessages(messages);
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : "获取消息失败");
  } finally {
    chatStore.setLoading(false);
  }
};

const handleCreateSession = async () => {
  try {
    chatStore.setLoading(true);
    const session = await chatApi.createSession(
      formModel.value.roleName,
      formModel.value.systemPrompt
    );
    chatStore.setSessions([...chatStore.sessions, session]);
    showCreateDialog.value = false;
    formModel.value = {
      roleName: "",
      systemPrompt: "",
    };
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : "创建会话失败");
  } finally {
    chatStore.setLoading(false);
  }
};

const handleDeleteSession = async (session: Session) => {
  if (!confirm("确定要删除该会话吗？")) return;

  try {
    chatStore.setLoading(true);
    await chatApi.deleteSession(session.sessionId);
    chatStore.setSessions(
      chatStore.sessions.filter((s) => s.sessionId !== session.sessionId)
    );
    if (chatStore.currentSession?.sessionId === session.sessionId) {
      chatStore.setCurrentSession(null);
      chatStore.clearMessages();
    }
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : "删除会话失败");
  } finally {
    chatStore.setLoading(false);
  }
};
</script>

<style scoped lang="scss">
.chat-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .sessions {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .session-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }

    &.active {
      background-color: #e6f4ff;
    }

    .session-info {
      flex: 1;
      margin-right: 8px;
      overflow: hidden;

      .title {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .last-message {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
