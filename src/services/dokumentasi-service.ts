import * as docRepo from "@/repositories/dokumentasi-repository";
import type {
  DocumentationCreateInput,
  DocumentationPublic,
  DocumentationType,
} from "@/types";

export async function getPublicDocumentations(filter: {
  type?: DocumentationType;
  limit?: number;
}): Promise<DocumentationPublic[]> {
  const docs = await docRepo.findDocumentations(filter);

  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    type: d.type as DocumentationType,
    imageUrl: d.imageUrl,
    eventDate: d.eventDate.toISOString(),
    createdAt: d.createdAt.toISOString(),
  }));
}

export async function createDocumentationItem(data: DocumentationCreateInput) {
  return await docRepo.createDocumentation(data);
}

export async function updateDocumentationItem(
  id: string,
  data: Partial<DocumentationCreateInput>
) {
  return await docRepo.updateDocumentation(id, data);
}

export async function deleteDocumentationItem(id: string) {
  return await docRepo.deleteDocumentation(id);
}
