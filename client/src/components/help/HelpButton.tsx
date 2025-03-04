import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { QuestionMarkCircledIcon, Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import wx_qrcode from "@/assets/images/wx_qrcode.png";

export function HelpButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-2"
          >
            <QuestionMarkCircledIcon className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px] p-4 sm:p-6 h-[90vh] sm:h-auto overflow-y-auto">
          <div className="absolute top-2 right-2">
            <DialogTitle className="sr-only text-xl font-bold">
              使用说明
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Cross2Icon className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="sr-only">
            量子皮皮虾平台功能介绍和联系方式
          </DialogDescription>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">功能介绍</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                量子皮皮虾是一个智能化的AI助手平台，为您提供全方位的AI解决方案：
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ AI对话
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">强大的DeepSeek-R1/V3模型支持</li>
                    <li className="list-disc">实时联网搜索，获取最新资讯</li>
                    <li className="list-disc">
                      可视化思维链，让AI决策过程更透明
                    </li>
                    <li className="list-disc">智能文件解析与深度分析</li>
                    <li className="list-disc">
                      专业角色模板库，一键定制AI助手
                    </li>
                    <li className="list-disc">支持 HTML 预览与渲染</li>
                  </ul>
                </li>
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ 知识库
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">
                      打造专属AI知识库，实现智能问答
                    </li>
                    <li className="list-disc">
                      基于向量的语义搜索，精准定位信息
                    </li>
                    <li className="list-disc">
                      全格式文档支持：PDF、Office、Markdown等
                    </li>
                  </ul>
                </li>
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ AI PPT生成
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">智能生成专业PPT框架</li>
                    <li className="list-disc">AI辅助内容优化与结构调整</li>
                    <li className="list-disc">所见即所得的实时编辑体验</li>
                    <li className="list-disc">一键生成精美演示幻灯片</li>
                  </ul>
                </li>
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ AI 阅读
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">DeepSeek 模型驱动的文档理解</li>
                    <li className="list-disc">一键生成文章摘要与精读分析</li>
                    <li className="list-disc">智能脑图可视化知识结构</li>
                    <li className="list-disc">支持 PDF 文档在线预览</li>
                    <li className="list-disc">历史文档管理与快速访问</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">联系方式</h3>
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 items-start">
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <p className="text-sm text-muted-foreground">
                    如有任何问题或建议，欢迎通过以下方式联系我：
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-16">📧 邮箱：</span>583175694@qq.com
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-16">💬 微信：</span>w583175694
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-16">📱 电话：</span>15876092583
                    </li>
                  </ul>
                </div>
                <div className="relative mx-auto sm:mx-0">
                  <Image
                    src={wx_qrcode}
                    alt="qrcode"
                    width={120}
                    height={120}
                    className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
