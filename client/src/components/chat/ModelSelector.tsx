import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chatService } from "@/lib/api";
import { toast } from "sonner";

interface Model {
  id: string;
  title: string;
  modelName: string;
  baseURL: string;
}

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ onModelChange, disabled }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    "bytedance_deepseek_r1"
  );

  useEffect(() => {
    // 获取可用的模型列表
    chatService
      .getModels()
      .then((data) => {
        setModels(data);
      })
      .catch((error) => {
        console.error("Failed to fetch models:", error);
        toast.error("加载模型列表失败");
      });
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange(modelId);
  };

  return (
    <Select
      value={selectedModel}
      onValueChange={handleModelChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="选择模型" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
