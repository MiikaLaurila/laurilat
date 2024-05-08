export enum EditableType {
  HEADING = 'heading',
  HEADING2 = 'heading2',
  HEADING3 = 'heading3',
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  LIST = 'list',
}

export enum PostType {
  HOME = 'home',
  PEOPLE = 'people',
  FOOD = 'food',
  GAMES = 'games',
  SPORTS = 'sports',
  OTHER = 'other',
}

export interface Editable {
  type: EditableType;
  content: string;
  id: string;
  meta?: Record<string, unknown>;
}

export interface EditableImageMeta {
  [key: string]: unknown;
  size: number;
}

export interface EditableImage extends Editable {
  meta: EditableImageMeta;
}

export interface ModifiedEditablePost {
  content: Editable[];
  author: string;
  type: PostType;
  draft: boolean;
  id?: string;
}

export interface ModifiedEditablePostWithId extends ModifiedEditablePost {
  id: string;
}

export interface EditablePost extends ModifiedEditablePostWithId {
  created: number;
  updated: number;
}

export const isEditablePost = (data: unknown): data is EditablePost => {
  if (data) {
    return ['content', 'author', 'created', 'updated', 'type', 'draft', 'id'].every((k) =>
      Object.prototype.hasOwnProperty.call(data, k)
    );
  }
  return false;
};
