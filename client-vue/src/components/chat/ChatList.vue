<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <button
        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        @click="handleCreateSession"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        新建会话
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="chatStore.loading" class="p-4 text-center text-gray-500">
        加载中...
      </div>
      <div
        v-else-if="chatStore.sessions.length === 0"
        class="p-4 text-center text-gray-500"
      >
        暂无会话
      </div>
      <div v-else class="space-y-1 p-2">
        <button
          v-for="session in chatStore.sessions"
          :key="session.sessionId"
          class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 group"
          :class="[
            session.sessionId === chatStore.currentSession?.sessionId
              ? 'bg-primary-50 text-primary-900'
              : 'hover:bg-gray-100 text-gray-700',
          ]"
          @click="handleSelectSession(session)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center min-w-0">
              <ChatBubbleLeftRightIcon
                class="w-5 h-5 mr-2 flex-shrink-0"
                :class="[
                  session.sessionId === chatStore.currentSession?.sessionId
                    ? 'text-primary-600'
                    : 'text-gray-400',
                ]"
              />
              <div class="truncate">
                <div class="font-medium truncate">
                  {{ session.firstMessage || "新会话" }}
                </div>
                <div class="text-sm text-gray-500 truncate">
                  {{ session.lastMessage || "暂无消息" }}
                </div>
              </div>
            </div>
            <Menu
              as="div"
              class="relative ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MenuButton
                class="flex items-center p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                @click.stop
              >
                <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
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
                  class="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        class="w-full text-left px-4 py-2 text-sm"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                        ]"
                        @click="handleEditSession(session)"
                      >
                        编辑
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        class="w-full text-left px-4 py-2 text-sm"
                        :class="[
                          active ? 'bg-red-50 text-red-900' : 'text-red-700',
                        ]"
                        @click="handleDeleteSession(session)"
                      >
                        删除
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div class="mt-1 text-xs text-gray-500">
            {{ formatTime(session.updatedAt) }}
          </div>
        </button>
      </div>
    </div>

    <TransitionRoot appear :show="isEditDialogOpen" as="template">
      <Dialog as="div" class="relative z-10" @close="closeEditDialog">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div>
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    {{ editingSession ? "编辑会话" : "新建会话" }}
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >角色名称</label
                      >
                      <input
                        type="text"
                        v-model="editForm.roleName"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="请输入角色名称（可选）"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >系统提示词</label
                      >
                      <textarea
                        v-model="editForm.systemPrompt"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="请输入系统提示词（可选）"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
                >
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    @click="handleSaveSession"
                  >
                    确定
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    @click="closeEditDialog"
                  >
                    取消
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { useChatStore } from "@/stores/chat";
import type { Session } from "@/types/chat";

const chatStore = useChatStore();
const isEditDialogOpen = ref(false);
const editingSession = ref<Session | null>(null);
const editForm = ref({
  roleName: "",
  systemPrompt: "",
});

const handleCreateSession = () => {
  editingSession.value = null;
  editForm.value = {
    roleName: "",
    systemPrompt: "",
  };
  isEditDialogOpen.value = true;
};

const handleEditSession = (session: Session) => {
  editingSession.value = session;
  editForm.value = {
    roleName: session.roleName || "",
    systemPrompt: session.systemPrompt || "",
  };
  isEditDialogOpen.value = true;
};

const handleDeleteSession = async (session: Session) => {
  if (confirm("确定要删除该会话吗？")) {
    try {
      await chatStore.deleteSession(session.sessionId);
    } catch (error) {
      console.error("删除会话失败:", error);
    }
  }
};

const handleSelectSession = (session: Session) => {
  chatStore.setCurrentSession(session);
};

const handleSaveSession = async () => {
  try {
    if (editingSession.value) {
      // TODO: 实现编辑会话功能
    } else {
      const session = await chatStore.createSession(
        editForm.value.roleName,
        editForm.value.systemPrompt
      );
      chatStore.setCurrentSession(session);
    }
    closeEditDialog();
  } catch (error) {
    console.error("保存会话失败:", error);
  }
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  editingSession.value = null;
  editForm.value = {
    roleName: "",
    systemPrompt: "",
  };
};

const formatTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("zh-CN", { hour12: false });
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString("zh-CN");
  }
};

// Load sessions when component is mounted
onMounted(async () => {
  try {
    await chatStore.loadSessions();
  } catch (error) {
    console.error("加载会话列表失败:", error);
  }
});
</script>
