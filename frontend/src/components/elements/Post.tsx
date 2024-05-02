import { useAppSelector } from '../../store/rootStore';
import { PostType } from '../../types/EditablePost';
import { EditableWrapper } from '../editables/EditableWrapper';
import { EditControls } from './EditControls';

interface Props {
  postType: PostType;
}

export const Post: React.FC<Props> = (props: Props) => {
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const editState = useAppSelector((state) => state.editableStore);

  const getPost = () => {
    if (editState.editing && editState.editedPost) {
      return editState.editedPost.content.map((editable) => <EditableWrapper key={editable.id} editable={editable} />);
    } else if (editState.currentPost) {
      return editState.currentPost.content.map((editable) => <EditableWrapper key={editable.id} editable={editable} />);
    }
  };

  return (
    <>
      {userInfo?.admin && <EditControls postType={props.postType} />}
      {getPost()}
    </>
  );
};
