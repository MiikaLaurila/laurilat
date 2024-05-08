import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import { Button } from '../form/Button';
import { cssColors, cssWidths } from '../../style/values';
import {
  addEditableToPost,
  setAddingItem,
  setEditedPost,
  setEditing,
  setHiglightedEditable,
} from '../../store/editableSlice';
import { EditableType, PostType } from '../../types/EditablePost';
import { getInitialEditable, getInitialPost } from '../../library/editables';
import deepEqual from 'deep-equal';
import { useState } from 'react';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useCreatePostMutation, useModifyPostMutation } from '../../store/postApi';

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

const EditControlsButtonCluster = styled('div')({
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

  const getNonEditControls = () => {
    return (
      <EditControlsDisabled>
        <Button
          onClick={() => {
            dispatch(setEditing(!editState.editing));
            if (!editState.currentPost) {
              dispatch(setEditedPost(getInitialPost(props.postType, userInfo?.username ?? '')));
            } else {
              dispatch(setEditedPost(structuredClone(editState.currentPost)));
            }
          }}
        >
          {'Edit Post'}
        </Button>
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
      <EditControlsButtonCluster>
        {Object.values(EditableType)
          .filter((v) => isNaN(Number(v)))
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
      </EditControlsButtonCluster>
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
      return !deepEqual(editState.currentPost.content, editState.editedPost.content);
    }
  };

  const saveCurrentPost = () => {
    if (editState.editedPost) {
      if (editState.editedPost.id) {
        modifyPostTrigger({
          content: editState.editedPost.content,
          author: editState.editedPost.author,
          type: editState.editedPost.type,
          draft: false,
          id: editState.editedPost.id,
        }).then(() => {
          setSaveEditDialogOpen(false);
        });
      } else {
        createPostTrigger({
          content: editState.editedPost.content,
          author: editState.editedPost.author,
          type: editState.editedPost.type,
          draft: false,
        }).then(() => {
          setSaveEditDialogOpen(false);
        });
      }
    }
  };

  const getEditControls = () => {
    return (
      <>
        <EditControlsEnabled>
          <EditControlsButtonCluster>
            <Button
              onClick={() => {
                if (isCurrentPostEdited()) {
                  setStopEditDialogOpen(true);
                } else {
                  dispatch(setEditing(!editState.editing));
                }
              }}
            >
              Stop Editing
            </Button>
            <Button
              onClick={() => {
                if (!isCurrentPostEdited()) {
                  return;
                } else {
                  setSaveEditDialogOpen(true);
                }
              }}
            >
              {editState.editedPost?.id ? 'Save modifications' : 'Create new post'}
            </Button>
            <Button
              onClick={() => {
                dispatch(setAddingItem(!editState.addingItem));
              }}
            >
              Add Content
            </Button>
          </EditControlsButtonCluster>
          {editState.addingItem && getAddContentControls()}
        </EditControlsEnabled>
        <ConfirmationModal
          title="Unsaved modificatons"
          content="Are you sure you want to discard all edits made to current post?"
          onCancel={() => {
            setStopEditDialogOpen(false);
          }}
          onConfirm={() => {
            setStopEditDialogOpen(false);
            dispatch(setEditing(!editState.editing));
          }}
          open={stopEditDialogOpen}
        />
        <ConfirmationModal
          title="Are you sure you want to save modifications"
          content=""
          onCancel={() => {
            setSaveEditDialogOpen(false);
          }}
          onConfirm={saveCurrentPost}
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
