<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <nav-sidebar />
    <div class="flex-1 overflow-hidden">
      <div class="h-full flex flex-col bg-white">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-medium text-gray-900">知识库</h1>
          <div>
            <input
              ref="fileInputRef"
              type="file"
              class="hidden"
              accept=".pdf,.txt,.md,.doc,.docx"
              @change="handleFileChange"
              multiple
            />
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isUploading"
              @click="() => fileInputRef?.click()"
            >
              <CloudArrowUpIcon class="w-5 h-5 mr-2" :class="{ 'animate-spin': isUploading }" />
              {{ isUploading ? '上传中...' : '上传文件' }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <div
              v-if="error"
              class="col-span-full p-4 bg-red-50 rounded-lg"
            >
              <div class="flex">
                <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">错误</h3>
                  <div class="mt-2 text-sm text-red-700">{{ error }}</div>
                </div>
              </div>
            </div>

            <div
              v-if="files.length === 0 && !error"
              class="col-span-full flex flex-col items-center justify-center py-12"
            >
              <DocumentIcon class="w-12 h-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">知识库还是空的</h3>
              <p class="mt-1 text-sm text-gray-500">开始上传文件来构建你的知识库</p>
              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  @click="() => fileInputRef?.click()"
                >
                  <PlusIcon class="w-5 h-5 mr-2" />
                  上传文件
                </button>
              </div>
            </div>

            <div
              v-for="file in files"
              :key="file.id"
              class="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <DocumentTextIcon class="w-8 h-8 text-gray-400" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 truncate max-w-[200px]" :title="file.filename">
                      {{ file.filename }}
                    </h3>
                    <div class="mt-1 text-xs text-gray-500 space-y-1">
                      <p>大小：{{ formatFileSize(file.size) }}</p>
                      <p>类型：{{ file.type }}</p>
                    </div>
                  </div>
                </div>
                <Menu as="div" class="relative">
                  <MenuButton
                    class="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <EllipsisVerticalIcon class="w-5 h-5 text-gray-400" />
                  </MenuButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <MenuItem v-slot="{ active }">
                        <button
                          class="w-full text-left px-4 py-2 text-sm"
                          :class="[
                            active ? 'bg-red-50 text-red-900' : 'text-red-700'
                          ]"
                          @click="() => handleDeleteFile(file.id)"
                        >
                          删除
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionGroup,
} from "@headlessui/vue";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { chatApi } from "@/api/chat";
import type { FileInfo } from "@/types/chat";
import NavSidebar from "@/components/layout/NavSidebar.vue";

const files = ref<FileInfo[]>([]);
const isUploading = ref(false);
const error = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement>();

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

// 处理文件选择
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    try {
      isUploading.value = true;
      error.value = null;
      
      for (const file of Array.from(input.files)) {
        await chatApi.uploadFile(file);
      }
      
      await loadFiles();
      input.value = ''; // 清空input以允许上传相同文件
    } catch (err) {
      error.value = err instanceof Error ? err.message : "上传文件失败";
      console.error(err);
    } finally {
      isUploading.value = false;
    }
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

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// 初始加载文件列表
loadFiles();
</script>
