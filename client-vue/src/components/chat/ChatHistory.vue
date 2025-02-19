<template>
  <div class="flex-1 overflow-y-auto p-5 bg-white" ref="historyRef">
    <div
      v-if="!chatStore.currentSession"
      class="h-full flex items-center justify-center text-gray-500 text-lg"
    >
      请选择或创建一个会话
    </div>
    <template v-else>
      <div
        v-if="chatStore.loading"
        class="h-full flex items-center justify-center text-gray-600 text-lg"
      >
        加载历史消息中...
      </div>
      <template v-else>
        <div
          v-if="chatStore.messages.length === 0"
          class="h-full flex items-center justify-center text-gray-500 text-lg"
        >
          暂无消息，开始对话吧
        </div>
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          class="mb-6 flex"
          :class="[
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
            { 'is-streaming': message.id === chatStore.streamingMessage?.id },
          ]"
        >
          <div
            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0"
            :class="[message.role === 'user' ? 'ml-3' : 'mr-3']"
          >
            {{ message.role === "user" ? "👤" : "🤖" }}
          </div>
          <div
            class="max-w-[80%] rounded-lg p-4"
            :class="[
              message.role === 'user' ? 'bg-blue-50' : 'bg-gray-50',
              message.id === chatStore.streamingMessage?.id
                ? 'border border-blue-100 bg-blue-50'
                : '',
            ]"
          >
            <template v-if="message.role === 'assistant'">
              <div
                v-if="message.reasoning"
                class="mb-4 p-3 bg-gray-100 rounded"
              >
                <div class="text-sm font-medium text-blue-600 mb-2">
                  思考过程：
                </div>
                <div
                  class="markdown-body"
                  v-html="renderMarkdown(message.reasoning)"
                />
              </div>
              <div v-if="message.content">
                <div class="text-sm font-medium text-green-600 mb-2">
                  回答：
                </div>
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
            <div
              v-if="message.sources"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <div class="text-sm font-medium text-gray-600 mb-2">
                参考来源：
              </div>
              <div
                class="markdown-body"
                v-html="renderMarkdown(message.sources)"
              />
            </div>
            <div
              v-if="message.id === chatStore.streamingMessage?.id"
              class="absolute bottom-2 right-2 flex gap-1"
            >
              <div
                v-for="i in 3"
                :key="i"
                class="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                :style="{ animationDelay: `${(i - 1) * 0.16}s` }"
              />
            </div>
            <div
              v-if="message.role === 'assistant'"
              class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center"
            >
              <div class="flex gap-2">
                <button
                  v-for="(action, index) in actions"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <component :is="action.icon" class="w-4 h-4 mr-1" />
                  {{ action.label }}
                </button>
              </div>
              <div class="flex gap-2">
                <button
                  class="p-1 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <HandThumbUpIcon class="w-5 h-5" />
                </button>
                <button
                  class="p-1 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <HandThumbDownIcon class="w-5 h-5" />
                </button>
              </div>
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
import {
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/vue/24/outline";
import { useChatStore } from "@/stores/chat";
import { chatApi } from "@/api/chat";

const chatStore = useChatStore();
const historyRef = ref<HTMLElement>();

const actions = [
  { icon: DocumentDuplicateIcon, label: "复制" },
  { icon: ArrowPathIcon, label: "刷新" },
  { icon: ShareIcon, label: "分享" },
  { icon: ArrowDownTrayIcon, label: "下载" },
];

// 监听会话变化，加载消息历史
watch(
  () => chatStore.currentSession,
  async (newSession) => {
    if (newSession) {
      try {
        await chatStore.setCurrentSession(newSession);
      } catch (error) {
        chatStore.setError(
          error instanceof Error ? error.message : "加载消息失败"
        );
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
      await chatStore.setCurrentSession(chatStore.currentSession);
    } catch (error) {
      chatStore.setError(
        error instanceof Error ? error.message : "加载消息失败"
      );
    }
  }
});
</script>

<style>
@import "highlight.js/styles/atom-one-dark.css";

.markdown-body {
  @apply text-sm leading-relaxed;
}

.markdown-body pre {
  @apply bg-gray-900 p-4 rounded-lg my-3 overflow-x-auto;
}

.markdown-body code {
  @apply font-mono text-white;
}

.markdown-body p {
  @apply my-2;
}

.markdown-body ul,
.markdown-body ol {
  @apply my-2 pl-5;
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

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}
</style>
