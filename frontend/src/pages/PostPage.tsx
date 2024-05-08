import { useParams } from 'react-router-dom';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { Post } from '../components/elements/Post';
import { MainContent } from '../components/frame/MainContent';
import { useGetPostQuery } from '../store/postApi';
import { PostType } from '../types/EditablePost';
import { useEffect } from 'react';
import { setCurrentPost } from '../store/editableSlice';
import { useAppSelector, useAppDispatch } from '../store/rootStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface Props {
  postType: PostType;
}

export const PostPage: React.FC<Props> = (props: Props) => {
  const { postId } = useParams<{ postId: string }>() as { postId: string };

  const postQuery = useGetPostQuery(postId);

  const editableState = useAppSelector((state) => state.editableStore);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!postQuery.isFetching && postQuery.data && editableState.currentPost?.id !== postQuery.data.id) {
      dispatch(setCurrentPost(postQuery.data));
    }
  }, [postQuery.data, postQuery.isFetching, editableState, dispatch]);

  return (
    <>
      <DefaultSideBar />
      <MainContent>
        {postQuery.isFetching ? <LoadingSpinner loadingText={'Loading post...'} /> : <Post postType={props.postType} />}
      </MainContent>
    </>
  );
};
