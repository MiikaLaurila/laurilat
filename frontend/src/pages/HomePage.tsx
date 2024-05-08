import { useEffect } from 'react';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { Post } from '../components/elements/Post';
import { MainContent } from '../components/frame/MainContent';
import { setCurrentPost } from '../store/editableSlice';
import { useGetHomePostQuery } from '../store/postApi';
import { useAppDispatch, useAppSelector } from '../store/rootStore';
import { PostType } from '../types/EditablePost';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const homePost = useGetHomePostQuery();
  const editableState = useAppSelector((state) => state.editableStore);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!homePost.isFetching && homePost.data && editableState.currentPost?.id !== homePost.data.id) {
      dispatch(setCurrentPost(homePost.data));
    }
  }, [homePost.data, homePost.isFetching, editableState, dispatch]);

  return (
    <>
      <DefaultSideBar />
      <MainContent>
        {homePost.isFetching ? <LoadingSpinner loadingText={'Loading Home Page'} /> : <Post postType={PostType.HOME} />}
      </MainContent>
    </>
  );
};
