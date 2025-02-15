"use client";

import { useEffect, useRef, useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService, fileService } from "@/lib/api";

export function ChatHistory() {
  // 添加消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSessionId } = useSessionManager();

  // 从 AI 聊天 hook 获取状态和方法
  const {
    messages,
    error,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  } = useAIChat();
  // 添加搜索状态
  const [searchState, setSearchState] = useState<{
    qichacha: string[] | null;
    collection: string[] | null;
    knowledge: string[] | null;
    web: string[] | null;
  }>({
    qichacha: null,
    collection: null,
    knowledge: null,
    web: null,
  });
  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 在消息列表变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSessionId]);

  // 加载会话消息历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSessionId) return;

      try {
        const data = await chatService.getSessionMessages(currentSessionId);
        setMessageList(data.messages);
      } catch (error) {
        console.error("加载消息历史失败:", error);
      }
    };

    loadMessages();
  }, [currentSessionId, setMessageList]);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) {
      throw new Error("No active session");
    }

    const result = await fileService.uploadTempFile(currentSessionId, file);
    return {
      name: file.name,
      path: result.filePath,
    };
  };

  // 处理文件删除
  const handleFileRemove = async () => {
    if (!currentSessionId) return;
    try {
      await fileService.cleanupTempFiles(currentSessionId);
    } catch (error) {
      console.error("文件删除失败:", error);
      throw error;
    }
  };

  // 处理搜索进度更新
  const handleSearchProgress = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 短暂延迟，等待消息框渲染

    // 启信宝查询
    setSearchState((prev) => ({
      ...prev,
      qichacha: [
        "深圳市皕瑞光电子有限公司",
        "经营状态：存续",
        "企业规模：小微",
        "法定代表人：郭百林",
        "统一社会信用代码：91440300MA5FRF7Q55",
        "注册资本：50 万人民币",
        "成立日期：2019-08-26",
        "所属行业：批发和零售业 > 批发业 > 机械设备、五金产品及电子产品批发 > 其他机械设备及电子产品批发（F5179）",
        "地址：深圳市光明区凤凰街道甲子塘社区甲子塘路二巷5号602",
        "简介：深圳市皕瑞光电子有限公司成立于2019-08-26，法定代表人为郭百林，注册资本为50 万人民币，统一社会信用代码为91440300MA5FRF7Q55，当前处于存续状态。企业注册地址位于深圳市光明区凤凰街道甲子塘社区甲子塘路二巷5号602，所属行业为其他机械设备及电子产品批发，经营范围包括：半导体设备、半导体材料、LED材料、LED设备、LED显示屏、LED灯具、电子材料的技术开发及销售；设备租赁；国内贸易，货物及技术进出口。（法律、行政法规或者国务院决定禁止和规定在登记前须经批准的项目除外）",
        "经营范围：半导体设备、半导体材料、LED材料、LED设备、LED显示屏、LED灯具、电子材料的技术开发及销售；设备租赁；国内贸易，货物及技术进出口。（法律、行政法规或者国务院决定禁止和规定在登记前须经批准的项目除外）",
      ],
    }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 催收系统查询
    setSearchState((prev) => ({
      ...prev,
      collection: [
        "客户授信总额度30万，在我行共有3笔借款。",
        "其中一笔自营借据，两笔 自营+上海银行借据。3笔借据共30万。",
        "截止2月10日，其中2笔借款已逾期，逾期25天，逾期金额共15433.32元。",
        "历史还款记录：",
        "客户近三个月都有还款记录，其中12月还款29456.33，1月还款14356.34，2月还款2345.32。",
        "不正常还款记录从2月开始",
        "客服历史触达情况：",
        "12月未联系上，1月19日、21日、22日、23日客户接听均表示没钱且态度敷衍",
      ],
    }));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 知识库查询
    setSearchState((prev) => ({
      ...prev,
      knowledge: [
        "1. 自营借据办理借新还旧36期，3+33，其中前三个月只还利息，再还33期本金加利息",
        "2. 银银借据，即”自营+外部银行”，3+20，先还三期利息，再还20期本金加利息",
      ],
    }));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 外网查询
    setSearchState((prev) => ({
      ...prev,
      web: [
        "中商产业研究院发布的《2024-2029中国led显示屏市场现状及未来发展趋势》显示，2023年我国led显示屏总体市场规模约为537亿元，同比增8.9%。中商产业研究院分析师预测，2024年led显示屏市场规模将增至634亿元。 数据来源：ggii、中商产业研究院整理. 2.小间距led显示屏",
        "source:2024年中国LED显示屏行业市场前景预测研究报告（简版），https://www.163.com/dy/article/J3TOG8S005198SOQ.html",
        "全球led显示屏市场规模持续扩大，据《2024-2029年中国led显示屏行业运营态势与投资前景调查研究报告》数据显示，2022年达到了82.9亿美元，2023年增长至89.6亿美元。预计未来几年，随着技术的不断创新和应用领域的不断拓展，市场规模将继续保持增长态势。",
        "Source: 2024年led显示屏行业分析：Led显示屏全球市场增长至89.6亿美元，https://www.chinabgao.com/freereport/96772.html",
        "中商产业研究院发布的《2024-2029中国led显示屏市场现状及未来发展趋势》显示，2023年我国led显示屏总体市场规模约为537亿元，同比增8.9%。中商产业研究院分析师预测，2024年led显示屏市场规模将增至634亿元。 数据来源：ggii、中商产业研究院整理. 2.小间距led显示屏",
        "Source: 2024年中国LED显示屏产业链图谱研究分析（附产业链全景图）|玻璃|偏光片|led显示屏_网易订阅，https://www.163.com/dy/article/JGSFNBU505198SOQ.html",
        '2024年，led显示屏市场承载着新的期望与信心，进入了新的发展阶段。在全球经济缓慢复苏的大背景下，led显示屏市场发生了哪些具体变化？它展现出哪些新趋势与特点？本文将从六大显示屏企业的2024半年报中找到答案。海外市场成为业绩增长的"引擎"led显示屏市场在经济周期中不断调整与成',
        "Source: Led显示进入新阶段，屏企下一步该往何处走? 2024年，Led显示屏市场承载着新的期望与信心，进入了新的发展阶段。https://xueqiu.com/8457709645/308276662",
        "2024全球LED显示屏市场展望与价格成本分析——TrendForce集邦咨询 ... 虽然2023年中国LED显示屏市场恢复情况不如预期，但是与2022年的低谷期相比，终端需求依然呈现成长趋势，尤其在企业会议与教育空间 (Corporation & Education)、广播表演 (Broadcast) 和零售与展览(Retail",
        "Source: 2024全球LED显示屏市场展望与价格成本分析——TrendForce集邦咨询 - 知乎，https://zhuanlan.zhihu.com/p/659838413",
      ],
    }));
  };

  // 如果没有选中的会话，显示提示信息
  if (!currentSessionId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        选择或创建一个对话开始聊天
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            // 空消息提示
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
              <h2 className="text-lg font-medium mb-2">开始一个新的对话</h2>
              <p className="text-sm text-center max-w-md">
                你可以问我任何问题，我会尽力帮助你。如果需要参考知识库中的内容，可以开启知识库搜索。
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={
                    isStreaming &&
                    message.id === messages[messages.length - 1].id
                  }
                  searchState={
                    message.role === "assistant" ? searchState : undefined
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
          {/* 错误提示 */}
          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
      </div>

      {/* 输入框区域 */}
      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={async (content, { useWebSearch, useVectorSearch }) => {
              // 发送实际消息，这会立即显示用户消息
              sendStreamMessage(content, currentSessionId, {
                useWebSearch,
                useVectorSearch,
              });
              if (useWebSearch) {
                // 重置搜索状态
                setSearchState({
                  qichacha: null,
                  collection: null,
                  knowledge: null,
                  web: null,
                });
                // 开始搜索进度更新
                handleSearchProgress();
              }
            }}
            disabled={!currentSessionId}
            isLoading={isStreaming}
            onAbort={abortStream}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            sessionId={currentSessionId}
          />
        </div>
      </div>
    </div>
  );
}
