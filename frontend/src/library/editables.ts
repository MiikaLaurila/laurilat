import { v4 } from 'uuid';
import { PostType, Post, EditableType, Editable } from '../types/EditablePost';

export const getInitialPost = (type: PostType, author: string): Post => {
  return {
    content: [],
    author,
    created: Date.now(),
    updated: Date.now(),
    type,
    id: v4(),
  };
};

export const getInitialEditable = (type: EditableType): Editable => {
  switch (type) {
    case EditableType.HEADING:
      return defaultEditable(type, 'This is heading type 1');
    case EditableType.HEADING2:
      return defaultEditable(type, 'This is heading type 2');
    case EditableType.IMAGE:
      return defaultEditable(type, 'This is an image');
    case EditableType.LIST:
      return defaultEditable(type, 'This is a list');
    case EditableType.PARAGRAPH:
      return defaultEditable(type, 'This is a paragraph');
    default:
      return defaultEditable(EditableType.HEADING, 'Check code... Fell through switch...');
  }
};

const defaultEditable = (type: EditableType, text: string) => {
  return {
    type,
    content: text,
    id: v4(),
    meta: {},
  };
};
