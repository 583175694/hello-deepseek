"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAgent: (agent: {
    name: string;
    description: string;
    type: "assistant" | "function" | "custom";
  }) => void;
}

export function CreateAgentDialog({
  open,
  onOpenChange,
  onCreateAgent,
}: CreateAgentDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"assistant" | "function" | "custom">(
    "assistant"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAgent({
      name,
      description,
      type,
    });
    // 重置表单
    setName("");
    setDescription("");
    setType("assistant");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建新的智能体</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="给你的智能体起个名字"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">类型</Label>
              <Select
                value={type}
                onValueChange={(value: "assistant" | "function" | "custom") =>
                  setType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择智能体类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assistant">助手型</SelectItem>
                  <SelectItem value="function">功能型</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述这个智能体的主要功能和特点"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={!name || !description}>
              创建
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
