<template>
  <div class="app-container">
    <nav-sidebar />
    <div class="main-container">
      <div class="knowledge-container">
        <div class="knowledge-header">
          <h1>知识库</h1>
          <n-upload
            ref="uploadRef"
            :custom-request="customUpload"
            :show-file-list="false"
            accept=".pdf,.txt,.md,.doc,.docx"
          >
            <n-button type="primary" :loading="isUploading">
              <template #icon>
                <n-icon><cloud-upload /></n-icon>
              </template>
              上传文件
            </n-button>
          </n-upload>
        </div>
        <div class="knowledge-content">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <div class="empty-state" v-if="files.length === 0">
            <n-empty description="知识库还是空的">
              <template #icon>
                <n-icon size="48"><document /></n-icon>
              </template>
              <template #extra>
                <n-upload
                  ref="uploadRef"
                  :custom-request="customUpload"
                  :show-file-list="false"
                  accept=".pdf,.txt,.md,.doc,.docx"
                >
                  <n-button type="primary" :loading="isUploading">
                    上传文件
                  </n-button>
                </n-upload>
              </template>
            </n-empty>
          </div>
          <div v-else class="file-list">
            <div v-for="file in files" :key="file.id" class="file-card">
              <div class="file-header">
                <n-icon size="24" class="file-icon">
                  <document />
                </n-icon>
                <n-button
                  circle
                  size="tiny"
                  class="delete-button"
                  @click="handleDeleteFile(file.id)"
                >
                  <template #icon>
                    <n-icon><trash /></n-icon>
                  </template>
                </n-button>
              </div>
              <div class="file-content">
                <h3 class="file-name">{{ file.filename }}</h3>
                <div class="file-info">
                  <span>大小：{{ (file.size / 1024).toFixed(2) }} KB</span>
                  <span>类型：{{ file.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NButton,
  NIcon,
  NEmpty,
  NUpload,
  type UploadCustomRequestOptions,
} from "naive-ui";
import { CloudUpload, Document, Trash } from "@vicons/ionicons5";
import { chatApi } from "@/api/chat";
import type { FileInfo } from "@/types/chat";
import NavSidebar from "@/components/layout/NavSidebar.vue";

const files = ref<FileInfo[]>([]);
const isUploading = ref(false);
const error = ref<string | null>(null);
const uploadRef = ref();

// 加载文件列表
const loadFiles = async () => {
  try {
    error.value = null;
    const fileList = await chatApi.getFiles();
    files.value = fileList;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "加载文件列表失败";
    console.error(err);
  }
};

// 自定义上传请求
const customUpload = async ({
  file,
  onFinish,
  onError,
}: UploadCustomRequestOptions) => {
  try {
    isUploading.value = true;
    error.value = null;
    await chatApi.uploadFile(file.file as File);
    await loadFiles();
    onFinish();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "上传文件失败";
    console.error(err);
    onError();
  } finally {
    isUploading.value = false;
  }
};

// 删除文件
const handleDeleteFile = async (fileId: string) => {
  if (!confirm("确定要删除该文件吗？")) return;

  try {
    error.value = null;
    await chatApi.deleteFile(fileId);
    await loadFiles();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "删除文件失败";
    console.error(err);
  }
};

// 初始加载文件列表
onMounted(() => {
  loadFiles();
});
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

.knowledge-container {
  height: 100vh;
  padding: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 16px 0;
    width: 100px;
  }

  .switches {
    display: flex;
    gap: 16px;
  }
}

.knowledge-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;

  .error-message {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #fef0f0;
    color: #f56c6c;
    border-radius: 4px;
    font-size: 14px;
  }

  .file-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    width: 100%;
    padding: 0;
    align-content: start;
  }

  .file-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
      border-color: #ccc;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .delete-button {
        opacity: 1;
      }
    }

    .file-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;

      .file-icon {
        color: #666;
      }

      .delete-button {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    .file-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .file-name {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .file-info {
        font-size: 12px;
        color: #999;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  }

  .empty-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
