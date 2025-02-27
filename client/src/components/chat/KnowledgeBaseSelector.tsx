"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fileService } from "@/lib/api";

interface KnowledgeBase {
  id: string;
  name: string;
}

interface KnowledgeBaseSelectorProps {
  onKnowledgeBaseChange: (id: string | null) => void;
  disabled?: boolean;
}

export function KnowledgeBaseSelector({
  onKnowledgeBaseChange,
  disabled,
}: KnowledgeBaseSelectorProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const data = await fileService.getKnowledgeBases();
        setKnowledgeBases(data);
      } catch (error) {
        console.error("Failed to fetch knowledge bases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, []);

  return (
    <Select
      onValueChange={(value) =>
        onKnowledgeBaseChange(value === "none" ? null : value)
      }
      disabled={disabled || loading}
    >
      <SelectTrigger className="h-7 w-[140px] text-xs lg:text-sm">
        <SelectValue placeholder="选择知识库" />
      </SelectTrigger>
      <SelectContent>
        {knowledgeBases.map((kb) => (
          <SelectItem key={kb.id} value={kb.id}>
            {kb.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
