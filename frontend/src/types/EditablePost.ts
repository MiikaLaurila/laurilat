export enum EditableType {
  TITLE = 'title',
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
  title: Editable;
  content: Editable[];
  author: string;
  type: PostType;
  draft: boolean;
  alias: string;
  meta?: Record<string, unknown>;
  id?: string;
}

export interface ModifiedEditablePostWithId extends ModifiedEditablePost {
  id: string;
}

export interface EditablePost extends ModifiedEditablePostWithId {
  created: number;
  updated: number;
}

export interface FoodEditablePostMeta {
  [key: string]: unknown;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FoodEditablePost extends EditablePost {
  meta: FoodEditablePostMeta;
}

export type EditablePostDescription = Pick<
EditablePost,
'title' | 'author' | 'created' | 'updated' | 'type' | 'id' | 'alias'
>;

export const isEditablePost = (data: unknown): data is EditablePost => {
  if (data) {
    return ['title', 'content', 'author', 'created', 'updated', 'type', 'draft', 'id', 'alias'].every((k) =>
      Object.prototype.hasOwnProperty.call(data, k)
    );
  }
  return false;
};

export const isFoodEditablePost = (data: unknown): data is FoodEditablePost => {
  if (isEditablePost(data)) {
    const hasMeta = ['meta'].every((k) => Object.prototype.hasOwnProperty.call(data, k));
    if (hasMeta) {
      return ['city', 'coordinates'].every((k) =>
        Object.prototype.hasOwnProperty.call((data as { meta: Record<string, unknown> }).meta, k)
      );
    }
  }
  return false;
};

export const isEditablePostDescriptions = (data: unknown): data is EditablePostDescription[] => {
  if (data) {
    // data has posts
    if (Object.prototype.hasOwnProperty.call(data, 'posts')) {
      // data is array
      if (Array.isArray((data as { posts: unknown }).posts)) {
        // empty array is valid
        if ((data as { posts: unknown[] }).posts.length === 0) return true;
        // every element contains needed keys
        return (data as { posts: unknown[] }).posts.every((potentialPost) => {
          return ['title', 'author', 'created', 'updated', 'type', 'id', 'alias'].every((k) =>
            Object.prototype.hasOwnProperty.call(potentialPost, k)
          );
        });
      }
    }
  }
  return false;
};
