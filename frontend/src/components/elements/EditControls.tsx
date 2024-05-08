import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import { Button } from '../form/Button';
import { cssColors, cssWidths } from '../../style/values';
import {
  addEditableToPost,
  modifyAliasOfPost,
  setAddingItem,
  setEditedPost,
  setEditing,
  setHiglightedEditable,
} from '../../store/editableSlice';
import { EditableType, ModifiedEditablePost, PostType } from '../../types/EditablePost';
import { getInitialEditable, getInitialPost } from '../../library/editables';
import deepEqual from 'deep-equal';
import React, { useState } from 'react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useCreatePostMutation, useModifyPostMutation } from '../../store/postApi';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../form/TextInput';

interface Props {
  postType: PostType;
}

const EditControlsDisabled = styled('div')({
  display: 'flex',
  gap: '1rem',
  position: 'fixed',
  bottom: '0rem',
  left: '50%',
  transform: `translate(calc(-100% + calc(${cssWidths.innerBody / 2}rem - 8px)), -50%)`,
});

const EditControlsEnabled = styled('div')({
  display: 'flex',
  height: '5rem',
  width: '100%',
  backgroundColor: cssColors.menuHover,
  borderTop: `1px solid ${cssColors.darkBorder}`,
  gap: '1rem',
  position: 'fixed',
  bottom: '0rem',
  left: 0,
  padding: '0rem 2rem',
  alignItems: 'center',
});

const EditControlsCluster = styled('div')({
  display: 'flex',
  gap: '0.5rem',
  height: '5rem',
  padding: '1.5rem 0rem',
  paddingRight: '1rem',
  borderRight: '1px solid black',
});

export const EditControls: React.FC<Props> = (props: Props) => {
  const editState = useAppSelector((state) => state.editableStore);
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const dispatch = useAppDispatch();
  const [stopEditDialogOpen, setStopEditDialogOpen] = useState(false);
  const [saveEditDialogOpen, setSaveEditDialogOpen] = useState(false);
  const [createPostTrigger] = useCreatePostMutation();
  const [modifyPostTrigger] = useModifyPostMutation();
  const navigator = useNavigate();

  const onEditPostButtonClick = () => {
    dispatch(setEditing(!editState.editing));
    if (!editState.currentPost && userInfo) {
      dispatch(setEditedPost(getInitialPost(props.postType, userInfo.username)));
    } else if (editState.currentPost) {
      dispatch(setEditedPost(structuredClone(editState.currentPost)));
    }
  };

  const getNonEditControls = () => {
    return (
      <EditControlsDisabled>
        <Button onClick={onEditPostButtonClick}>{'Edit Post'}</Button>
      </EditControlsDisabled>
    );
  };

  const handleAddContent = (type: EditableType) => {
    const newEditable = getInitialEditable(type);
    dispatch(setHiglightedEditable(newEditable));
    dispatch(addEditableToPost(newEditable));
  };

  const getAddContentControls = () => {
    return (
      <EditControlsCluster>
        {Object.values(EditableType)
          .filter((v) => isNaN(Number(v)))
          .filter((editableType) => editableType !== EditableType.TITLE)
          .map((editableType) => {
            return (
              <Button
                key={`add-edit-${editableType}`}
                onClick={() => {
                  handleAddContent(editableType);
                }}
              >
                {editableType}
              </Button>
            );
          })}
      </EditControlsCluster>
    );
  };

  const onInputAliasField = (evt: React.FormEvent<HTMLInputElement>) => {
    dispatch(modifyAliasOfPost(evt.currentTarget.value.trim()));
  };

  const getEditAliasField = () => {
    return (
      <EditControlsCluster style={{ padding: '0.5rem 1rem 0rem 0rem' }}>
        <TextInput title="post id alias" defaultText={editState.editedPost?.alias} onInput={onInputAliasField} />
      </EditControlsCluster>
    );
  };

  const isCurrentPostEdited = () => {
    if (!editState.currentPost) {
      if (editState.editedPost && editState.editedPost.content.length > 0) {
        return true;
      }
      return false;
    }
    if (editState.editedPost) {
      return (
        !deepEqual(editState.currentPost.content, editState.editedPost.content) ||
        !deepEqual(editState.currentPost.title, editState.editedPost.title) ||
        editState.currentPost.alias !== editState.editedPost.alias
      );
    }
  };

  const createBaseSaveData = (editedPost: ModifiedEditablePost) => {
    return {
      title: editedPost.title,
      content: editedPost.content,
      author: editedPost.author,
      type: editedPost.type,
      alias: editedPost.alias,
      draft: false,
    };
  };

  const onConfirmSavePost = () => {
    if (editState.editedPost) {
      const currentType = editState.editedPost.type;
      const currentId = editState.editedPost.id;
      const currentAlias = editState.editedPost.alias;
      if (currentId) {
        modifyPostTrigger({
          ...createBaseSaveData(editState.editedPost),
          id: currentId,
        }).then(() => {
          setSaveEditDialogOpen(false);
          if (currentType !== PostType.HOME) {
            navigator(`/${currentType}/${currentAlias ? currentAlias : currentId}`);
          }
        });
      } else {
        createPostTrigger({
          ...createBaseSaveData(editState.editedPost),
          title: editState.editedPost.title,
        }).then((response) => {
          setSaveEditDialogOpen(false);
          if ('data' in response) {
            if (currentType !== PostType.HOME) {
              navigator(`/${currentType}/${response.data.alias ? response.data.alias : response.data.id}`);
            }
          }
        });
      }
    }
  };

  const onStopEditingClick = () => {
    if (isCurrentPostEdited()) {
      setStopEditDialogOpen(true);
    } else {
      dispatch(setEditing(false));
    }
  };

  const onSaveEditClick = () => {
    if (!isCurrentPostEdited()) {
      return;
    } else {
      setSaveEditDialogOpen(true);
    }
  };

  const onAddItemClick = () => {
    dispatch(setAddingItem(!editState.addingItem));
  };

  const onConfirmStopEdit = () => {
    setStopEditDialogOpen(false);
    dispatch(setEditing(false));
  };

  const getEditControls = () => {
    return (
      <>
        <EditControlsEnabled>
          <EditControlsCluster>
            <Button onClick={onStopEditingClick}>Stop Editing</Button>
            <Button onClick={onSaveEditClick}>
              {editState.editedPost?.id ? 'Save modifications' : 'Create new post'}
            </Button>
            <Button onClick={onAddItemClick}>Add Content</Button>
          </EditControlsCluster>
          {getEditAliasField()}
          {editState.addingItem && getAddContentControls()}
        </EditControlsEnabled>
        <ConfirmationModal
          title="Unsaved modificatons"
          content="Are you sure you want to discard all edits made to current post?"
          onCancel={() => {
            setStopEditDialogOpen(false);
          }}
          onConfirm={onConfirmStopEdit}
          open={stopEditDialogOpen}
        />
        <ConfirmationModal
          title="Are you sure you want to save modifications"
          content=""
          onCancel={() => {
            setSaveEditDialogOpen(false);
          }}
          onConfirm={onConfirmSavePost}
          open={saveEditDialogOpen}
        />
      </>
    );
  };

  if (!editState.editing) {
    return getNonEditControls();
  } else {
    return getEditControls();
  }
};
