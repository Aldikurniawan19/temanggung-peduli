import { prisma } from "@/lib/prisma";
import type { DocumentationCreateInput, DocumentationType } from "@/types";

export interface FindDocumentationsFilter {
  type?: DocumentationType;
  limit?: number;
  offset?: number;
}

export async function findDocumentations(filter: FindDocumentationsFilter = {}) {
  const where = filter.type ? { type: filter.type } : {};
  return await prisma.documentation.findMany({
    where,
    take: filter.limit ?? 20,
    skip: filter.offset ?? 0,
    orderBy: { eventDate: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      imageUrl: true,
      eventDate: true,
      createdAt: true,
    },
  });
}

export async function findDocumentationById(id: string) {
  return await prisma.documentation.findUnique({
    where: { id },
  });
}

export async function createDocumentation(data: DocumentationCreateInput) {
  return await prisma.documentation.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      imageUrl: data.imageUrl,
      eventDate: new Date(data.eventDate),
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      imageUrl: true,
      eventDate: true,
      createdAt: true,
    },
  });
}

export async function updateDocumentation(
  id: string,
  data: Partial<DocumentationCreateInput>
) {
  return await prisma.documentation.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.type && { type: data.type }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
    },
  });
}

export async function deleteDocumentation(id: string) {
  return await prisma.documentation.delete({
    where: { id },
    select: { id: true },
  });
}
