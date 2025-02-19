<template>
  <div class="chat-history" ref="historyRef">
    <div v-if="!chatStore.currentSession" class="empty-state">
      请选择或创建一个会话
    </div>
    <template v-else>
      <div v-if="chatStore.loading" class="loading-state">
        加载历史消息中...
      </div>
      <template v-else>
        <div v-if="chatStore.messages.length === 0" class="empty-state">
          暂无消息，开始对话吧
        </div>
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          class="message-item"
          :class="[
            message.role,
            { 'is-streaming': message.id === chatStore.streamingMessage?.id },
          ]"
        >
          <div class="avatar">
            {{ message.role === "user" ? "👤" : "🤖" }}
          </div>
          <div class="content">
            <template v-if="message.role === 'assistant'">
              <div v-if="message.reasoning" class="reasoning">
                <div class="title">思考过程：</div>
                <div
                  class="markdown-body"
                  v-html="renderMarkdown(message.reasoning)"
                />
              </div>
              <div v-if="message.content" class="answer">
                <div class="title">回答：</div>
                <div
                  class="markdown-body"
                  v-html="renderMarkdown(message.content)"
                />
              </div>
            </template>
            <template v-else>
              <div
                class="markdown-body"
                v-html="renderMarkdown(message.content)"
              />
            </template>
            <div v-if="message.sources" class="sources">
              <div class="title">参考来源：</div>
              <div
                class="markdown-body"
                v-html="renderMarkdown(message.sources)"
              />
            </div>
            <div
              v-if="message.id === chatStore.streamingMessage?.id"
              class="streaming-indicator"
            >
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div v-if="message.role === 'assistant'" class="message-actions">
              <n-button-group>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><copy /></n-icon>
                  </template>
                  复制
                </n-button>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><refresh /></n-icon>
                  </template>
                  刷新
                </n-button>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><share-social /></n-icon>
                  </template>
                  分享
                </n-button>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><download /></n-icon>
                  </template>
                  下载
                </n-button>
              </n-button-group>
              <n-button-group>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><thumbs-up /></n-icon>
                  </template>
                </n-button>
                <n-button size="tiny" secondary>
                  <template #icon>
                    <n-icon><thumbs-down /></n-icon>
                  </template>
                </n-button>
              </n-button-group>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import { NButton, NButtonGroup, NIcon } from "naive-ui";
import {
  Copy,
  Refresh,
  ShareSocial,
  Download,
  ThumbsUp,
  ThumbsDown,
} from "@vicons/ionicons5";
import { useChatStore } from "@/stores/chat";
import { chatApi } from "@/api/chat";

const chatStore = useChatStore();
const historyRef = ref<HTMLElement>();

// 监听会话变化，加载消息历史
watch(
  () => chatStore.currentSession,
  async (newSession) => {
    if (newSession) {
      try {
        chatStore.setLoading(true);
        const { messages } = await chatApi.getMessages(newSession.sessionId);
        chatStore.setMessages(messages);
      } catch (error) {
        chatStore.setError(
          error instanceof Error ? error.message : "加载消息失败"
        );
      } finally {
        chatStore.setLoading(false);
      }
    } else {
      chatStore.clearMessages();
    }
  }
);

// 配置 marked
const markedOptions = {
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: true,
  highlight: (code: string, language: string) => {
    const lang = language || "";
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
};

marked.setOptions(markedOptions);

const renderMarkdown = (content: string) => {
  if (!content) return "";
  try {
    return marked(content);
  } catch (e) {
    console.error("Error rendering markdown:", e);
    return content;
  }
};

// 监听消息变化，自动滚动到底部
watch(
  () => chatStore.messages,
  () => {
    nextTick(() => {
      if (historyRef.value) {
        historyRef.value.scrollTop = historyRef.value.scrollHeight;
      }
    });
  },
  { deep: true }
);

// 初始加载消息
onMounted(async () => {
  if (chatStore.currentSession) {
    try {
      chatStore.setLoading(true);
      const { messages } = await chatApi.getMessages(
        chatStore.currentSession.sessionId
      );
      chatStore.setMessages(messages);
    } catch (error) {
      chatStore.setError(
        error instanceof Error ? error.message : "加载消息失败"
      );
    } finally {
      chatStore.setLoading(false);
    }
  }
});
</script>

<style scoped lang="scss">
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fff;

  .empty-state,
  .loading-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 16px;
  }

  .loading-state {
    color: #666;
  }

  .message-item {
    display: flex;
    margin-bottom: 24px;
    opacity: 1;
    transition: opacity 0.3s ease;

    &.is-streaming .content {
      border: 1px solid #e6f4ff;
      background: #f0f7ff;
    }

    &.user {
      flex-direction: row-reverse;

      .avatar {
        margin-left: 12px;
        margin-right: 0;
      }

      .content {
        background: #e6f4ff;
      }
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .content {
      max-width: 80%;
      background: #f9f9f9;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
      position: relative;

      :deep(.markdown-body) {
        background: transparent;
        font-size: 14px;

        pre {
          background: #282c34;
          padding: 16px;
          border-radius: 8px;
          margin: 12px 0;
          overflow-x: auto;
        }

        code {
          color: #fff;
          font-family: "Fira Code", monospace;
        }

        p {
          margin: 8px 0;
        }

        ul,
        ol {
          margin: 8px 0;
          padding-left: 20px;
        }
      }

      .reasoning,
      .answer,
      .sources {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;

        &:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .title {
          font-weight: 500;
          margin-bottom: 8px;
          color: #666;
        }
      }

      .reasoning {
        background: #f8f9fa;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;

        .title {
          color: #1a73e8;
        }
      }

      .answer {
        .title {
          color: #188038;
        }
      }

      .streaming-indicator {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: flex;
        gap: 4px;
        align-items: center;

        .dot {
          width: 4px;
          height: 4px;
          background-color: #1890ff;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;

          &:nth-child(1) {
            animation-delay: 0s;
          }

          &:nth-child(2) {
            animation-delay: 0.16s;
          }

          &:nth-child(3) {
            animation-delay: 0.32s;
          }
        }
      }
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.message-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;

  :deep(.n-button-group) {
    .n-button {
      padding: 4px 12px;
      color: #666;

      &:hover {
        color: #333;
      }

      .n-icon {
        margin-right: 4px;
      }
    }
  }
}
</style>
