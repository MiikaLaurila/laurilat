export enum EditableType {
  HEADING = 'heading',
  HEADING2 = 'heading2',
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

export interface Post {
  content: Editable[];
  author: string;
  created: number;
  updated: number;
  type: PostType;
  id: string;
}
