<template>
  <div class="chat-input">
    <div class="toolbar">
      <n-space>
        <n-upload
          ref="uploadRef"
          :custom-request="customUpload"
          :show-file-list="false"
          @change="handleUploadChange"
        >
          <n-button>
            <template #icon>
              <n-icon><attach-outline /></n-icon>
            </template>
            上传文件
          </n-button>
        </n-upload>
        <n-switch v-model:value="useWeb">
          <template #checked>启用网络搜索</template>
          <template #unchecked>禁用网络搜索</template>
        </n-switch>
        <n-switch v-model:value="useKnowledge">
          <template #checked>启用知识库</template>
          <template #unchecked>禁用知识库</template>
        </n-switch>
      </n-space>
    </div>

    <div class="input-area">
      <n-input
        v-model:value="content"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 5 }"
        placeholder="输入消息，按 Enter 发送，Shift + Enter 换行"
        @keydown="handleKeyDown"
      />
      <n-button type="primary" :disabled="isDisabled" @click="handleSend">
        发送
      </n-button>
    </div>

    <div v-if="uploadingFiles.length > 0" class="upload-list">
      <div
        v-for="file in uploadingFiles"
        :key="file.file.name"
        class="upload-item"
      >
        <div class="file-info">
          <span class="filename">{{ file.file.name }}</span>
          <span class="progress">{{ file.progress }}%</span>
        </div>
        <n-progress
          :percentage="file.progress"
          :processing="file.status === 'uploading'"
          :status="file.status === 'error' ? 'error' : 'success'"
        />
        <div v-if="file.error" class="error-message">
          {{ file.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  NButton,
  NInput,
  NSpace,
  NSwitch,
  NUpload,
  NProgress,
  NIcon,
  type UploadCustomRequestOptions,
} from "naive-ui";
import { AttachOutline } from "@vicons/ionicons5";
import { useChatStore } from "@/stores/chat";
import { chatApi } from "@/api/chat";
import type { UploadFile } from "@/types/chat";

const chatStore = useChatStore();
const content = ref("");
const useWeb = ref(false);
const useKnowledge = ref(false);
const uploadingFiles = ref<UploadFile[]>([]);

// 使用计算属性来判断是否禁用发送按钮
const isDisabled = computed(() => {
  return !content.value.trim() || !chatStore.currentSession?.sessionId;
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
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
    const controller = new AbortController();
    try {
      await chatApi.streamChat(
        chatStore.currentSession!.sessionId,
        userMessage.content,
        controller.signal,
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
    }
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : "发送消息失败");
  } finally {
    chatStore.setSendingMessage(false);
    chatStore.streamingMessage.value = null;
  }
};

const customUpload = async ({
  file,
  onFinish,
  onError,
}: UploadCustomRequestOptions) => {
  const uploadFile: UploadFile = {
    file,
    progress: 0,
    status: "uploading",
  };
  uploadingFiles.value.push(uploadFile);

  try {
    const fileInfo = await chatApi.uploadFile(file);
    uploadFile.progress = 100;
    uploadFile.status = "success";
    onFinish();
  } catch (error) {
    uploadFile.status = "error";
    uploadFile.error = error instanceof Error ? error.message : "上传失败";
    onError();
  }
};

const handleUploadChange = (options: { file: UploadFile }) => {
  if (options.file.status === "finished") {
    uploadingFiles.value = uploadingFiles.value.filter(
      (file) => file.file.name !== options.file.file.name
    );
  }
};
</script>

<style scoped lang="scss">
.chat-input {
  border-top: 1px solid #eee;
  padding: 16px;
  background: #fff;

  .toolbar {
    margin-bottom: 12px;
  }

  .input-area {
    display: flex;
    gap: 12px;
  }

  .upload-list {
    margin-top: 12px;

    .upload-item {
      margin-bottom: 8px;

      .file-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-size: 12px;

        .filename {
          color: #666;
        }

        .progress {
          color: #999;
        }
      }

      .error-message {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
}
</style>
