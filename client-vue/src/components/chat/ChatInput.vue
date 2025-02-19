<template>
  <div class="border-t border-gray-200 p-4 bg-white">
    <div class="mb-3 flex gap-3">
      <div class="flex gap-2">
        <button
          class="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          @click="uploadRef?.click()"
        >
          <PaperClipIcon class="w-4 h-4 mr-1" />
          上传文件
        </button>
        <input
          ref="uploadRef"
          type="file"
          class="hidden"
          @change="handleFileChange"
          multiple
        />
      </div>
      <div class="flex gap-3">
        <Switch
          v-model="useWeb"
          :class="[
            useWeb ? 'bg-primary-500' : 'bg-gray-200',
            'relative inline-flex h-7 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          ]"
        >
          <span class="sr-only">启用网络搜索</span>
          <span
            :class="[
              useWeb ? 'translate-x-5' : 'translate-x-1',
              'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
            ]"
          />
        </Switch>
        <span class="text-sm text-gray-600"
          >{{ useWeb ? "启用" : "禁用" }}网络搜索</span
        >
      </div>
      <div class="flex gap-3">
        <Switch
          v-model="useKnowledge"
          :class="[
            useKnowledge ? 'bg-primary-500' : 'bg-gray-200',
            'relative inline-flex h-7 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          ]"
        >
          <span class="sr-only">启用知识库</span>
          <span
            :class="[
              useKnowledge ? 'translate-x-5' : 'translate-x-1',
              'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
            ]"
          />
        </Switch>
        <span class="text-sm text-gray-600"
          >{{ useKnowledge ? "启用" : "禁用" }}知识库</span
        >
      </div>
    </div>

    <div class="flex gap-3">
      <div class="flex-1">
        <textarea
          v-model="content"
          rows="1"
          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm resize-none"
          :class="{ 'opacity-50': chatStore.sendingMessage }"
          placeholder="输入消息，按 Enter 发送，Shift + Enter 换行"
          :disabled="chatStore.sendingMessage"
          @keydown="handleKeyDown"
          @input="autoResize"
          ref="textareaRef"
        />
      </div>
      <button
        v-if="!chatStore.sendingMessage"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isDisabled"
        @click="handleSend"
      >
        <PaperAirplaneIcon class="w-4 h-4 mr-1" />
        发送
      </button>
      <button
        v-else
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        @click="handleStop"
      >
        <StopIcon class="w-4 h-4 mr-1" />
        停止
      </button>
    </div>

    <TransitionGroup
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
      class="mt-3 space-y-2"
    >
      <div
        v-for="file in uploadingFiles"
        :key="file.file.name"
        class="bg-gray-50 rounded-lg p-3"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-600">{{ file.file.name }}</span>
          <span class="text-sm text-gray-500">{{ file.progress }}%</span>
        </div>
        <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-300 rounded-full"
            :class="{
              'bg-primary-500': file.status === 'uploading',
              'bg-green-500': file.status === 'success',
              'bg-red-500': file.status === 'error',
            }"
            :style="{ width: `${file.progress}%` }"
          />
        </div>
        <div v-if="file.error" class="mt-1 text-sm text-red-500">
          {{ file.error }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Switch } from "@headlessui/vue";
import {
  PaperClipIcon,
  PaperAirplaneIcon,
  StopIcon,
} from "@heroicons/vue/24/outline";
import { useChatStore } from "@/stores/chat";
import { chatApi } from "@/api/chat";
import type { UploadFile } from "@/types/chat";

const chatStore = useChatStore();
const content = ref("");
const useWeb = ref(false);
const useKnowledge = ref(false);
const uploadingFiles = ref<UploadFile[]>([]);
const controller = ref<AbortController | null>(null);
const uploadRef = ref<HTMLInputElement>();
const textareaRef = ref<HTMLTextAreaElement>();

const isDisabled = computed(() => {
  return !content.value.trim() || !chatStore.currentSession?.sessionId;
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      handleUpload(file);
    });
  }
  input.value = "";
};

const handleUpload = async (file: File) => {
  const uploadFile = {
    file,
    progress: 0,
    status: "uploading" as const,
    error: undefined as string | undefined,
  };
  uploadingFiles.value.push(uploadFile);

  try {
    await chatApi.uploadFile(file);
    uploadFile.progress = 100;
    uploadFile.status = "success";
    setTimeout(() => {
      uploadingFiles.value = uploadingFiles.value.filter(
        (f) => f.file.name !== file.name
      );
    }, 2000);
  } catch (error) {
    uploadFile.status = "error";
    uploadFile.error = error instanceof Error ? error.message : "上传失败";
  }
};

const handleStop = () => {
  if (controller.value) {
    controller.value.abort();
    controller.value = null;
    chatStore.setSendingMessage(false);
    if (chatStore.streamingMessage) {
      chatStore.streamingMessage = null;
    }
  }
};

const handleSend = async () => {
  if (isDisabled.value) return;

  try {
    chatStore.setSendingMessage(true);
    // 先添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: content.value,
      type: "content" as const,
      createdAt: new Date().toISOString(),
    };
    chatStore.addMessage(userMessage);
    content.value = ""; // 清空输入框
    autoResize(); // 重置输入框高度

    // 创建一个初始的AI消息
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage = {
      id: aiMessageId,
      role: "assistant" as const,
      content: "",
      reasoning: "",
      type: "content" as const,
      createdAt: new Date().toISOString(),
    };

    let accumulatedContent = "";
    let accumulatedReasoning = "";

    // 发送消息并处理流式响应
    controller.value = new AbortController();
    try {
      await chatApi.streamChat(
        chatStore.currentSession!.sessionId,
        userMessage.content,
        controller.value.signal,
        (chunk) => {
          try {
            // 解析 SSE 数据
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") return;

                try {
                  const { type, content } = JSON.parse(data);
                  // 根据类型累积不同的内容
                  if (type === "content") {
                    accumulatedContent += content;
                  } else if (type === "reasoning") {
                    accumulatedReasoning += content;
                  }

                  // 更新流式消息
                  chatStore.updateStreamingMessage({
                    ...initialAiMessage,
                    content: accumulatedContent,
                    reasoning: accumulatedReasoning,
                  });
                } catch (e) {
                  console.error("Error parsing JSON:", e, data);
                }
              }
            }
          } catch (e) {
            console.error("Error processing chunk:", e, chunk);
          }
        }
      );

      // 流式响应结束后，添加最终消息
      if (accumulatedContent || accumulatedReasoning) {
        chatStore.addMessage({
          ...initialAiMessage,
          content: accumulatedContent,
          reasoning: accumulatedReasoning,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        throw error;
      }
    } finally {
      controller.value = null;
    }
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : "发送消息失败");
  } finally {
    chatStore.setSendingMessage(false);
    if (chatStore.streamingMessage) {
      chatStore.streamingMessage = null;
    }
  }
};
</script>
