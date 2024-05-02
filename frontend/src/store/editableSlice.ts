import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Editable, Post } from '../types/EditablePost';

interface EditableState {
  editing: boolean;
  addingItem: boolean;
  currentPost?: Post;
  editedPost?: Post;
  highlightedEditable?: Editable;
}

const initialState: EditableState = { editing: false, addingItem: false } as const;

export const editableSlice = createSlice({
  name: 'editable',
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        editing: action.payload,
        highlightedEditable: undefined,
        editedPost: undefined,
        addingItem: false,
      };
    },
    setAddingItem: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        addingItem: action.payload,
      };
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      return {
        ...state,
        currentPost: action.payload,
      };
    },
    setEditedPost: (state, action: PayloadAction<Post>) => {
      return {
        ...state,
        editedPost: action.payload,
      };
    },
    setHiglightedEditable: (state, action: PayloadAction<Editable | undefined>) => {
      return {
        ...state,
        highlightedEditable: action.payload,
      };
    },
    addEditableToPost: (state, action: PayloadAction<Editable>) => {
      if (!state.editedPost) return state;
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          content: [...state.editedPost.content, action.payload],
        },
      };
    },
    modifyEditableOfPost: (state, action: PayloadAction<Editable>) => {
      if (!state.editedPost) return state;
      const newEditables = [...state.editedPost.content];
      const editableToModify = newEditables.findIndex((e) => e.id === action.payload.id);
      if (editableToModify < 0) return state;
      newEditables.splice(editableToModify, 1, action.payload);
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          content: newEditables,
        },
      };
    },
    deleteEditableFromPost: (state, action: PayloadAction<string>) => {
      if (!state.editedPost) return state;
      const newEditables = [...state.editedPost.content].filter((e) => e.id != action.payload);
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          content: newEditables,
        },
      };
    },
  },
});

export const {
  setEditing,
  setAddingItem,
  setCurrentPost,
  setEditedPost,
  setHiglightedEditable,
  addEditableToPost,
  modifyEditableOfPost,
  deleteEditableFromPost,
} = editableSlice.actions;
