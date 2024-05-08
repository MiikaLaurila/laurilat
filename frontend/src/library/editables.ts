import { v4 } from 'uuid';
import { PostType, EditablePost, EditableType, Editable, EditableImageMeta } from '../types/EditablePost';

export const getInitialPost = (type: PostType, author: string): EditablePost => {
  return {
    content: [],
    author,
    created: Date.now(),
    updated: Date.now(),
    type,
    draft: true,
    id: '',
  };
};

export const getInitialEditable = (type: EditableType): Editable => {
  switch (type) {
    case EditableType.HEADING:
      return defaultEditable(type, 'This is heading type 1');
    case EditableType.HEADING2:
      return defaultEditable(type, 'This is heading type 2');
    case EditableType.HEADING3:
      return defaultEditable(type, 'This is heading type 3');
    case EditableType.IMAGE:
      return defaultEditable(type, '', { size: 10 } as EditableImageMeta);
    case EditableType.LIST:
      return defaultEditable(type, 'This is a list');
    case EditableType.PARAGRAPH:
      return defaultEditable(type, 'This is a paragraph');
    default:
      return defaultEditable(EditableType.HEADING, 'Check code... Fell through switch...');
  }
};

const defaultEditable = (type: EditableType, text: string, meta?: Record<string, unknown>) => {
  return {
    type,
    content: text,
    id: v4(),
    meta,
  };
};
