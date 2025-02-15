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

  const handleCreate = () => {
    if (roleName.trim() === "" && systemPrompt.trim() === "") {
      onCreateSession();
    } else {
      onCreateSession({
        roleName: roleName.trim(),
        systemPrompt: systemPrompt.trim(),
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建新会话</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleName" className="text-right">
              角色名称
            </Label>
            <Input
              id="roleName"
              placeholder="可选，例如：专业程序员"
              className="col-span-3"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="systemPrompt" className="text-right">
              系统提示词
            </Label>
            <Textarea
              id="systemPrompt"
              placeholder="可选，例如：你是一个专业的程序员，擅长编写高质量的代码和解决技术问题。"
              className="col-span-3"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
