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

  const getEditControls = () => {
    return (
      <EditControlsEnabled>
        <EditControlsButtonCluster>
          <Button
            onClick={() => {
              dispatch(setEditing(!editState.editing));
            }}
          >
            {'Stop Editing'}
          </Button>
          <Button>{'Save Modifications'}</Button>
          <Button
            onClick={() => {
              dispatch(setAddingItem(!editState.addingItem));
            }}
          >
            {'Add Content'}
          </Button>
        </EditControlsButtonCluster>
        {editState.addingItem && getAddContentControls()}
      </EditControlsEnabled>
    );
  };

  if (!editState.editing) {
    return getNonEditControls();
  } else {
    return getEditControls();
  }
};
