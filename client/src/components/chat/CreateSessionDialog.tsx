import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { chatService } from "@/lib/api";
import { toast } from "sonner";

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (params?: {
    roleName: string;
    systemPrompt: string;
  }) => void;
}

export function CreateSessionDialog({
  open,
  onOpenChange,
  onCreateSession,
}: CreateSessionDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreate = () => {
    if (roleName.trim() === "" && systemPrompt.trim() === "") {
      onCreateSession();
    } else {
      onCreateSession({
        roleName: roleName.trim(),
        systemPrompt: systemPrompt.trim(),
      });
    }
    setRoleName("");
    setSystemPrompt("");
    onOpenChange(false);
  };

  const handleGeneratePrompt = async () => {
    const trimmedRoleName = roleName.trim();
    if (!trimmedRoleName) {
      return;
    }

    setIsGenerating(true);
    try {
      const { systemPrompt: generatedPrompt } =
        await chatService.generatePrompt(trimmedRoleName);
      setSystemPrompt(generatedPrompt);
    } catch (error) {
      console.error("生成系统提示词失败:", error);
      toast.error("生成系统提示词失败");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95%] max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">创建新会话</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="roleName" className="sm:text-right">
              角色名称
            </Label>
            <div className="flex gap-2 sm:col-span-3">
              <Input
                id="roleName"
                placeholder="可选，例如：专业程序员"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleGeneratePrompt}
                disabled={!roleName.trim() || isGenerating}
                className="shrink-0 px-3 h-10 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                title="生成系统提示词"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>生成</span>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="systemPrompt" className="sm:text-right">
              系统提示词
            </Label>
            <Textarea
              id="systemPrompt"
              placeholder="可选，例如：你是一个专业的程序员，擅长编写高质量的代码和解决技术问题。"
              className="sm:col-span-3 min-h-[160px] max-h-[240px]"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:mt-2">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              取消
            </Button>
            <Button onClick={handleCreate} className="flex-1 sm:flex-none">
              创建
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
