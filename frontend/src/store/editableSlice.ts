import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Editable, EditablePost, ModifiedEditablePost, PostType } from '../types/EditablePost';
import { postApi } from './postApi';
import { getInitialPost } from '../library/editables';

interface EditableState {
  editing: boolean;
  addingItem: boolean;
  currentPost?: EditablePost;
  editedPost?: ModifiedEditablePost;
  highlightedEditable?: Editable;
}

const initialState: EditableState = { editing: false, addingItem: false } as const;

const swapElements = <T>(array: T[], idx1: number, idx2: number) => {
  const temp = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = temp;
};

const intialEditState = {
  editing: false,
  highlightedEditable: undefined,
  editedPost: undefined,
  addingItem: false,
} as const;

export const editableSlice = createSlice({
  name: 'editable',
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        ...intialEditState,
        editing: action.payload,
      };
    },
    initializeEditingNewPage: (state, action: PayloadAction<{ type: PostType; author: string }>) => {
      return {
        ...state,
        ...intialEditState,
        editing: true,
        editedPost: getInitialPost(action.payload.type, action.payload.author),
        currentPost: undefined,
      };
    },
    setAddingItem: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        addingItem: action.payload,
      };
    },
    setCurrentPost: (state, action: PayloadAction<EditablePost>) => {
      return {
        ...state,
        ...intialEditState,
        currentPost: action.payload,
      };
    },
    setEditedPost: (state, action: PayloadAction<ModifiedEditablePost>) => {
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
    modifyTitleOfPost: (state, action: PayloadAction<Editable>) => {
      if (!state.editedPost) return state;
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          title: action.payload,
        },
      };
    },
    modifyAliasOfPost: (state, action: PayloadAction<string>) => {
      if (!state.editedPost) return state;
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          alias: action.payload,
        },
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
    moveEditableOfPost: (state, action: PayloadAction<{ editable: Editable; direction: 'up' | 'down' }>) => {
      if (!state.editedPost) return state;
      const newEditables = [...state.editedPost.content];
      const currentEditableIndex = newEditables.findIndex((e) => e.id === action.payload.editable.id);
      if (currentEditableIndex < 0) return state;
      if (action.payload.direction === 'up' && currentEditableIndex > 0 && newEditables.length >= 2) {
        swapElements(newEditables, currentEditableIndex, currentEditableIndex - 1);
      } else if (
        action.payload.direction === 'down' &&
        currentEditableIndex <= newEditables.length - 2 &&
        newEditables.length >= 2
      ) {
        swapElements(newEditables, currentEditableIndex, currentEditableIndex + 1);
      }
      return {
        ...state,
        editedPost: {
          ...state.editedPost,
          content: newEditables,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(postApi.endpoints.createPost.matchFulfilled, (state) => {
        return {
          ...state,
          ...intialEditState,
          currentPost: undefined,
        };
      })
      .addMatcher(postApi.endpoints.modifyPost.matchFulfilled, (state) => {
        return {
          ...state,
          ...intialEditState,
          currentPost: undefined,
        };
      });
  },
});

export const {
  setEditing,
  initializeEditingNewPage,
  setAddingItem,
  setCurrentPost,
  setEditedPost,
  setHiglightedEditable,
  modifyTitleOfPost,
  modifyAliasOfPost,
  addEditableToPost,
  modifyEditableOfPost,
  deleteEditableFromPost,
  moveEditableOfPost,
} = editableSlice.actions;
