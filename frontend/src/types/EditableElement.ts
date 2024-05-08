import { Editable } from './EditablePost';

export interface EditableElement {
  editable: Editable;
  onModify: (content: string, meta?: Record<string, unknown>) => void;
  highlighted?: boolean;
}
