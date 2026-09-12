import type { Generation } from "@prisma/client";

export interface GenerationDTO {
  id: string;
  type: string;
  prompt: string;
  refImageUrl: string | null;
  resultUrl: string | null;
  status: string;
  provider: string;
  creditsCost: number;
  createdAt: string;
}

export function toGenerationDTO(generation: Generation): GenerationDTO {
  return {
    id: generation.id,
    type: generation.type,
    prompt: generation.prompt,
    refImageUrl: generation.refImageUrl,
    resultUrl: generation.resultUrl,
    status: generation.status,
    provider: generation.provider,
    creditsCost: generation.creditsCost,
    createdAt: generation.createdAt.toISOString(),
  };
}
