import React from 'react';
import { useAppSelector } from '../../store/rootStore';
import { ModifiedEditablePost, PostType } from '../../types/EditablePost';
import { EditableWrapper } from '../editables/EditableWrapper';
import { BasicEditControls } from './BasicEditControls';

interface Props {
  postType: PostType;
  extraEditControls?: React.ReactNode;
}

export const Post: React.FC<Props> = (props: Props) => {
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const editState = useAppSelector((state) => state.editableStore);

  const getPostContent = (post: ModifiedEditablePost) => {
    return (
      <>
        {<EditableWrapper key={post.title.id} editable={post.title} />}
        {post.content.map((editable) => (
          <EditableWrapper key={editable.id} editable={editable} />
        ))}
      </>
    );
  };

  const getPost = () => {
    if (editState.editing && editState.editedPost) {
      return getPostContent(editState.editedPost);
    } else if (editState.currentPost) {
      return getPostContent(editState.currentPost);
    }
  };

  const canEdit = () => {
    if (userInfo?.admin) return true;
    if (props.postType === PostType.HOME && !userInfo?.admin) {
      return false;
    }
    return editState.currentPost?.author === userInfo?.username;
  };

  return (
    <>
      {canEdit() && <BasicEditControls postType={props.postType} extraEditControls={props.extraEditControls} />}
      {getPost()}
    </>
  );
};
