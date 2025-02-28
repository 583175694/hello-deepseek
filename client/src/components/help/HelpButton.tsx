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
            className="rounded-full h-12 w-12 shadow-lg"
          >
            <QuestionMarkCircledIcon className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[565px]">
          <DialogHeader>
            <DialogTitle>使用说明</DialogTitle>
            <DialogDescription asChild>
              <span className="sr-only">量子皮皮虾平台功能介绍和联系方式</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 mt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">功能介绍</h3>
              <p className="text-sm text-muted-foreground">
                量子皮皮虾是一个强大的AI助手平台，集成了多种智能功能：
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li className="list-none space-y-1">
                  <span className="font-medium">⭐️ AI对话：</span>
                  <ul className="pl-5 pt-1 space-y-1">
                    <li>支持联网实时搜索，获取最新信息</li>
                    <li>展示AI的思考过程，提供透明的推理过程</li>
                    <li>支持 DeepSeek-R1/V3满血版</li>
                    <li>支持文件上传和智能分析功能</li>
                  </ul>
                </li>
                <li className="list-none space-y-1">
                  <span className="font-medium">⭐️ 知识库：</span>
                  <ul className="pl-5 pt-1 space-y-1">
                    <li>创建专属知识库，训练定制化AI助手</li>
                    <li>支持PDF、Word、Excel等多种文档格式导入</li>
                    <li>智能向量搜索，精准匹配相关内容</li>
                  </ul>
                </li>
                <li className="list-none space-y-1">
                  <span className="font-medium">⭐️ AI PPT生成：</span>
                  <ul className="pl-5 pt-1 space-y-1">
                    <li>一键生成专业PPT大纲</li>
                    <li>AI智能优化内容和结构</li>
                    <li>支持实时预览和编辑</li>
                    <li>集成AIPPT，生成精美幻灯片</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">联系方式</h3>
              <div className="flex flex-row justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    如有任何问题或建议，欢迎通过以下方式联系我：
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>邮箱：583175694@qq.com</li>
                    <li>微信：w583175694</li>
                    <li>电话：15876092583</li>
                  </ul>
                </div>
                <Image src={wx_qrcode} alt="qrcode" width={120} height={120} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
