import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
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
        <DialogContent className="sm:max-w-[825px] p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="sr-only text-2xl font-bold">
              使用说明
            </DialogTitle>
            <DialogDescription asChild>
              <span className="sr-only">量子皮皮虾平台功能介绍和联系方式</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-xl">功能介绍</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                量子皮皮虾是一个强大的AI助手平台，集成了多种智能功能：
              </p>
              <ul className="grid grid-cols-2 gap-4 mt-4">
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ AI对话
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">
                      支持联网实时搜索，获取最新信息
                    </li>
                    <li className="list-disc">
                      展示AI的思考过程，提供透明的推理过程
                    </li>
                    <li className="list-disc">支持 DeepSeek-R1/V3满血版</li>
                    <li className="list-disc">支持文件上传和智能分析功能</li>
                  </ul>
                </li>
                <li className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ 知识库
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">
                      创建专属知识库，训练定制化AI助手
                    </li>
                    <li className="list-disc">
                      支持PDF、Word、Excel等多种文档格式导入
                    </li>
                    <li className="list-disc">
                      智能向量搜索，精准匹配相关内容
                    </li>
                  </ul>
                </li>
                <li className="space-y-2 p-4 rounded-lg bg-muted/30 col-span-2 sm:col-span-1">
                  <span className="font-medium text-base inline-flex items-center gap-2">
                    ⭐️ AI PPT生成
                  </span>
                  <ul className="pl-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="list-disc">一键生成专业PPT大纲</li>
                    <li className="list-disc">AI智能优化内容和结构</li>
                    <li className="list-disc">支持实时预览和编辑</li>
                    <li className="list-disc">集成AIPPT，生成精美幻灯片</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-xl">联系方式</h3>
              <div className="flex flex-row justify-between gap-6 items-start">
                <div className="flex flex-col gap-3">
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
                <div className="relative">
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
